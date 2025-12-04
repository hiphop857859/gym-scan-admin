import { useState, useEffect, useCallback } from 'react'
import { CACHE_TIME_DEFAULT } from 'src/constants'
import { useToast } from './useToast'
import { AxiosError } from 'axios'

const cache = new Map<string, { data: any; expiry: number }>()

type QueryOptions = {
  cacheTime?: number
  noCache?: boolean
}

type TQuery<TData, TParams> = {
  func: (params: TParams) => Promise<TData>
  options?: QueryOptions
  params?: TParams
  isQuery?: boolean
  onSuccess?: (data: TData) => void
  onError?: (error: AxiosError) => void
}

const generateCacheKey = <TParams>(funcName: string, params: TParams) => {
  return `${funcName}-${JSON.stringify(params)}`
}

export const useQuery = <TData, TParams>({
  func,
  options,
  params,
  isQuery,
  onSuccess,
  onError
}: TQuery<TData, TParams>) => {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError | null>(null)

  const { showError } = useToast()

  const queryData = useCallback(
    async (_params: TParams | undefined = params, noCache: boolean = false) => {
      const cacheKey = generateCacheKey(func.name, _params)

      const cachedResult = cache.has(cacheKey) ? cache.get(cacheKey) : undefined

      if (!noCache && !options?.noCache && cachedResult && cachedResult.expiry > Date.now()) {
        setData(cachedResult.data)

        if (onSuccess) onSuccess(cachedResult.data)

        return
      } else {
        setLoading(true)
        try {
          const result = await func(_params ? _params : ({} as TParams))
          setData(result)
          setLoading(false)
          if (onSuccess) {
            onSuccess(result)
          }
          cache.set(cacheKey, {
            data: result,
            expiry: Date.now() + (options?.cacheTime || CACHE_TIME_DEFAULT) // Cache with default time
          })
        } catch (err) {
          const typedError = err as AxiosError
          setError(typedError)
          setLoading(false)
          if (onError) {
            onError(typedError)
          }
        }
      }
    },
    [func, params, onSuccess, onError, options?.cacheTime, options?.noCache]
  )

  const fetchData = useCallback(
    async (_params: TParams) => {
      setLoading(true)
      try {
        const result = await func(_params)
        setData(result)

        if (onSuccess) {
          onSuccess(result)
        }
      } catch (err) {
        const typedError = err as AxiosError<{ message: string | string[] }>

        const message = Array.isArray(typedError.response?.data?.message)
          ? typedError.response.data.message[0]
          : typedError.response?.data?.message ||
            typedError.message || // fallback
            '' // final fallback

        if (message) {
          showError(message)
        }

        setError(typedError)

        if (!message && onError) {
          onError(typedError)
        }
      } finally {
        setLoading(false)
      }
    },
    [func, onSuccess, showError, onError]
  )

  useEffect(() => {
    if (isQuery) {
      queryData()
    }
  }, [isQuery])

  const refetch = useCallback(
    (_params?: TParams) => {
      const __params =
        !_params && !params ? undefined : ({ ...(_params ? { ...params, ..._params } : { ...params }) } as TParams)

      queryData(__params, true)
    },
    [queryData]
  )

  return { data, loading, error, fetch: fetchData, refetch }
}
