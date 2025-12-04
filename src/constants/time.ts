export const FORMAT_TIME_HOUR = 'HH[h]mm'
export const FORMAT_TIME_HOUR_DOT = 'HH[:]mm'
export const FORMAT_TIME_HOUR_FULL_DAY = 'hh:mm'
export const FORMAT_TIME_MONTH = 'D MMMM'
export const FORMAT_TIME_YEAR = 'D MMMM, YYYY'
export const FORMAT_DAY_MONTH_YEAR = 'D MMM YYYY'
export const FORMAT_MONTH_YEAR = 'MMMM YYYY'
export const UTC_FORMAT_TIME_STRING = 'YYYY-MM-DDTHH:mm:ss[Z]'
export const UTC_FORMAT_DATE_TIME = 'DD/MM/YYYY HH:mm:ss'
export const UTC_FORMAT_LOCAL = 'YYYY-MM-DDTHH:mm:ss.SSS'
export const FORMAT_STRING_LOCAL_TIME = 'YYYY-MM-DDTHH:mm:ss.[00]'
export const DEFAULT_TIME_ONLY = '00:00:00.00'
export const FORMAT_DATE = 'DD/MM/YYYY'
export const FORMAT_DATE_TIME_12H = 'DD/MM/YYYY [at] hh:mm A'

export const second = 1000
export const minute = 60 * second
export const hour = 60 * minute
export const day = 24 * hour
export const month = 30 * day

export const MAPPING_FORMAT_BY_TIME_ZONE = Object.freeze({
  'en-US': 'MM/DD/YYYY', // Mỹ
  'vi-VN': 'DD/MM/YYYY', // Việt Nam
  'fr-FR': 'DD/MM/YYYY', // Pháp
  'de-DE': 'DD.MM.YYYY', // Đức
  'ja-JP': 'YYYY/MM/DD', // Nhật Bản
  'zh-CN': 'YYYY-MM-DD' // Trung Quốc
})
