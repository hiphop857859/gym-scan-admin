import { useCallback, useState, useRef, useEffect } from 'react'
import { PageParams } from 'src/types'
import { debounce, isString } from 'lodash'
import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios'
import { CACHE_TIME_DEFAULT } from 'src/constants'
import { useCache } from 'src/Hook/useCache'

type useSearchParam<T> = {
  func: (params: PageParams, config: AxiosRequestConfig) => Promise<T>
  normalizationData?: (baseData: any[], data: any) => any[]
  loadMoreNormalizationData?: (oldData: any[], newData: any) => any[]
  defaultBaseData?: any[]
  cacheTime?: number
}

export const useSearch = <T>(options: useSearchParam<T>) => {
  const {
    func,
    defaultBaseData = [],
    normalizationData = (baseData: any[], data: any) => [...baseData, ...data.data],
    loadMoreNormalizationData = (oldData: any[], newData: any) => [...oldData, ...newData.data],
    cacheTime = CACHE_TIME_DEFAULT
  } = options || {}
  const [baseData, setBaseData] = useState<any[]>(defaultBaseData)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)
  const mountedRef = useRef(false)
  const { generateCacheKey, getCache, setCache } = useCache({ cacheTime })

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted')
      }
    }
  }, [])

  const hitCache = useCallback(
    (params: PageParams) => {
      const { limit = 5, page = 1, q, ...restParam } = params
      const _q = isString(q) ? q?.trim?.() : ''
      const cacheKey = generateCacheKey({
        name: func.name,
        limit,
        page,
        q: _q,
        ...restParam
      })
      const cachedResult = getCache(cacheKey)
      if (cachedResult) {
        // Cancel previous request if exists
        if (cancelTokenSourceRef.current) {
          cancelTokenSourceRef.current.cancel('Hit cache')
        }

        setResults(normalizationData(baseData, cachedResult.data) as any[])
        setLoading(false)
        setLoadingMore(false)

        return true
      }

      return false
    },
    [func.name, generateCacheKey, getCache, normalizationData, baseData]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(async (params: PageParams & { isLoadMore?: boolean }) => {
      const { limit = 5, page = 1, q, isLoadMore = false, ...restParam } = params
      const _q = isString(q) ? q?.trim?.() : ''
      const cacheKey = generateCacheKey({
        name: func.name,
        limit,
        page,
        q: _q,
        ...restParam
      })

      // Cancel previous request if exists
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Operation canceled for new request')
      }

      // Create new cancel token
      // eslint-disable-next-line import/no-named-as-default-member
      const source = axios.CancelToken.source()
      cancelTokenSourceRef.current = source

      try {
        if (!mountedRef.current) return
        const data = await func(
          {
            limit,
            page,
            q: _q,
            ...restParam
          },
          {
            cancelToken: source.token
          }
        )
        if (isLoadMore) {
          setResults((prev) => loadMoreNormalizationData(prev, data))
        } else {
          setResults(normalizationData(baseData, data) as any[])
        }
        setCache(cacheKey, data)
        setLoading(false)
        setLoadingMore(false)

        // Check if there's more data to load
        const responseData = data as any
        const newData = responseData?.data || []
        setHasMore(newData.length >= limit)
        setCurrentPage(page)
      } catch (error) {
        if (axios.isCancel(error)) return

        setLoading(false)
        setLoadingMore(false)
      }
    }, 500),
    [func]
  )

  const triggerSearch = useCallback(
    (params: PageParams) => {
      setCurrentPage(1)
      setHasMore(true)

      if (hitCache(params)) {
        handleSearch.cancel()

        return
      }

      setResults([])
      setLoading(true)
      handleSearch(params)
    },
    [handleSearch, hitCache]
  )

  const loadMore = useCallback(
    (params: PageParams) => {
      if (!hasMore || loadingMore) return

      const nextPage = currentPage + 1
      const { limit = 5, q, ...restParam } = params
      const _q = isString(q) ? q?.trim?.() : ''

      setLoadingMore(true)
      handleSearch({
        isLoadMore: true,
        limit,
        page: nextPage,
        q: _q,
        ...restParam
      })
    },
    [hasMore, loadingMore, currentPage, handleSearch]
  )

  return {
    triggerSearch,
    loadMore,
    results,
    loading,
    loadingMore,
    hasMore,
    currentPage,
    setBaseData,
    setResults
  }
}
