export const parseToJson = (data: string | undefined | null) => {
  try {
    const json = data ? JSON.parse(data) : {}
    return json
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
}

export const cleanObject = (object: object) => {
  const filteredObj = Object.fromEntries(Object.entries(object).filter(([, value]) => Boolean(value)))

  return filteredObj
}

export const convertCommaToDot = (numberString?: string | null) => {
  return numberString ? parseFloat(numberString.toString().replace(',', '.')) : 0
}

export const convertDotToComma = (number?: number) => {
  return number && number.toString().replace('.', ',')
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getKeyFromValue = (obj: Record<string, string>, value: string) => {
  return Object.keys(obj).find((key) => obj[key] === value)
}

export const capitalizeFirstLetter = (str?: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) || '' : '')

export const parseArrayToObjectBoolean = <T extends string>(array: Array<T>) => {
  return array.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: true
    }
  }, {})
}

export const formatToEuro = (number: number | undefined) => {
  if (number === undefined || number === null) return '0 €'

  let formattedNumber = new Intl.NumberFormat('de-DE', {
    useGrouping: true,
    minimumFractionDigits: 0
  }).format(Math.round(number))

  formattedNumber = formattedNumber.replace(/\./g, ' ')

  return `${formattedNumber} €`
}

export const randomNumBetween = (min: number, max: number) => Math.random() * (max - min) + min

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return { r, g, b }
}

export const isBrowser = () => typeof window !== 'undefined'

export const formatDigitNumber = (number?: number) => {
  return number ? Math.round(number * 10) / 10 : 0
}

export const formatNumber = (number?: number) => {
  return convertDotToComma(formatDigitNumber(number))
}
