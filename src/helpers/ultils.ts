import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'

export const orderListByKey = (array: Array<any>, key = '', order = 'asc') =>
  array.sort((objA, objB) => {
    if (((objA[key] as string) || '')?.toLowerCase().localeCompare((objB[key] as string)?.toLowerCase(), 'fr') < 0) {
      return order === 'asc' ? -1 : 1
    }
    if (((objA[key] as string) || '')?.toLowerCase().localeCompare((objB[key] as string)?.toLowerCase(), 'fr') > 0) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  }) || []

export const checkIsVaLidJson = (string: string) => {
  try {
    JSON.parse(string)
  } catch (e) {
    return false
  }
  return true
}

export const getSearchValueLocal = (key: string) => {
  if (window.localStorage && localStorage.getItem(key) && checkIsVaLidJson(localStorage.getItem(key) as string)) {
    return JSON.parse(localStorage.getItem(key) as string)
  }
  return null
}

export const getBase64ImageFromUrl = async (imageUrl: string) => {
  const res = await fetch(imageUrl)

  const blob = await res.blob()

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(blob)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export const keyDownHandler = (action: () => void) => (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === '/') {
    action()
  }
}

export function customIsEmpty<T>(value: T): boolean {
  if (value === false) return false
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0
  if (typeof value === 'string') return value.trim().length === 0
  return !value
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

export const formatTimeFromDecimal = (decimalTime: number) => {
  const hours = Math.floor(decimalTime)
  const minutes = Math.round((decimalTime - hours) * 60)
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

export const formatDecimalFromTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number) // Split into hours and minutes
  return hours + minutes / 60 // Calculate decimal time
}

export const rangeTimePicker = (end: number, start = 0) => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}

export const getSingerErrorMessage = (error: any) => {
  const errorMessage = error?.['message']?.[0] ?? 'Something went wrong'
  const responseData = error?.response?.data
  if (_isString(responseData?.message)) return responseData?.message
  if (_isArray(responseData?.message) && _isString(responseData?.message[0])) return responseData?.message[0]

  return errorMessage
}

export const checkIsFormError = (error: any) => {
  return error && typeof error === 'object' && 'values' in error && 'errorFields' in error
}
