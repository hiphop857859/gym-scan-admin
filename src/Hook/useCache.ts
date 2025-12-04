import { useCallback, useMemo } from 'react'
import { CACHE_TIME_DEFAULT } from 'src/constants'
export const useCache = (options?: { cacheTime?: number }) => {
  const { cacheTime: globalCacheTime = CACHE_TIME_DEFAULT } = options || {}

  const cache = useMemo(() => new Map<string, { data: any; expiry: number }>(), [])
  const generateCacheKey = (objectKeys: Record<string, string | number>) => {
    if (objectKeys.name) {
      return `${name}-${JSON.stringify(objectKeys)}`
    }

    return `${JSON.stringify(objectKeys)}`
  }

  const getCache = useCallback(
    (key: string) => {
      const cachedResult = cache.has(key) ? cache.get(key) : undefined
      if (cachedResult && Date.now() < cachedResult.expiry) {
        return cachedResult
      }

      return false
    },
    [cache]
  )

  const setCache = useCallback(
    (cacheKey: string, data: any, cacheTime: number = globalCacheTime) =>
      cache.set(cacheKey, {
        data,
        expiry: Date.now() + cacheTime // Cache with default time
      }),
    [cache, globalCacheTime]
  )

  return {
    generateCacheKey,
    getCache,
    setCache
  }
}
