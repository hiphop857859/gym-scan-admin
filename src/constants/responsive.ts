export const MEDIA_SCREEN = {
  '3xl': '1700px',
  dashboard: '1440px',
  '2xl': '1536px',
  xl: '1280px',
  lg: '1024px',
  sm: '640px',
  md: '768px',
  mobile: '376px'
} as const

type MediaScreenKeys = keyof typeof MEDIA_SCREEN

type MediaQueryType = {
  [K in MediaScreenKeys as `min_w_${K}`]: string
} & {
  [K in MediaScreenKeys as `max_w_${K}`]: string
}

export const MEDIA_QUERY_STRING = Object.keys(MEDIA_SCREEN).reduce((acc, item) => {
  const key = item as MediaScreenKeys
  acc[`min_w_${key}`] = `(min-width:${MEDIA_SCREEN[key]})`
  acc[`max_w_${key}`] = `(max-width:${MEDIA_SCREEN[key]})`
  return acc
}, {} as MediaQueryType)
