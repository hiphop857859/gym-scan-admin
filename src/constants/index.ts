import { minute } from './time'

export const EMAIL_REG_EXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const FRENCH_PHONE_REG_EXP = /^(?:\+33|0)[1-9](?:\s?\d{2}){4}$/

export const PASSWORD_REGEXP = /^(?=.*[^\w\s])(?=.*[A-Z]).{12,}$/

export const NUMBER_FLOAT_REGEX = /^[+-]?([0-9]*[.,])?[0-9]+$/

export const SWITCH_PROFILE_FLAG = 'SWITCH_PROFILE_FLAG'

export const CACHE_TIME_DEFAULT = minute

export const LANGUAGE = {
  french: 'fr',
  english: 'en'
} as const
