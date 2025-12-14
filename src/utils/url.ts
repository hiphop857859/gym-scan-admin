import { Params } from 'src/types'
import { cleanObject } from './system'

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
export const parseUrl = (url = '', data?: Params) => {
  const { params, vars } =
    (data as { vars?: { [key: string]: string }; params?: { [key: string]: string | string[] } }) || {}
  console.log('parseUrl params', params)
  console.log('parseUrl vars', vars)

  if (vars) {
    Object.keys(vars)?.forEach((i) => {
      url = url.replace(`{${i}}`, vars[i])
    })
  }

  if (params) {
    const searchParams = new URLSearchParams()

    Object.keys(cleanObject(params)).forEach((key) => {
      const value = params[key]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== 'all') {
            searchParams.append(key, item)
          }
        })
      } else {
        if (value !== 'all') {
          searchParams.append(key, value as string)
        }
      }
    })

    url = `${url}?${searchParams.toString()}`
  }

  return url
}
