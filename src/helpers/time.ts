import dayjs, { Dayjs, OpUnitType } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/fr'
import { UTC_FORMAT_DATE_TIME, UTC_FORMAT_TIME_STRING } from 'src/constants/time'

dayjs.extend(utc)
dayjs.extend(timezone)

export default dayjs

const userTimezone = dayjs.tz.guess()

export const formatTimeString = (date: dayjs.ConfigType, format = UTC_FORMAT_DATE_TIME) => {
  return dayjs(date).local().format(format?.toString())
}

export const formatTimeByLocal = (utcTime: dayjs.ConfigType, format = UTC_FORMAT_DATE_TIME) => {
  return dayjs.utc(utcTime).local().format(format)
}

export const formatTimeStrinlOCAL = (date: dayjs.ConfigType, format = UTC_FORMAT_DATE_TIME) => {
  return dayjs(date).format(format?.toString())
}
export const formatTimeLocalToUtc = (date: dayjs.ConfigType, format = UTC_FORMAT_TIME_STRING) => {
  return dayjs.tz(date, userTimezone).utc().format(format)
}

export const formatTimeIso = (date: dayjs.ConfigType, timezone = userTimezone, format = UTC_FORMAT_TIME_STRING) => {
  return dayjs.tz(date, timezone).utc().format(format).toString()
}

export const formatTimeStartOfDate = (date: dayjs.ConfigType, format = UTC_FORMAT_TIME_STRING) => {
  return dayjs(date).startOf('day').format(format).toString()
}

export const formatTimeEndOfDate = (date: dayjs.ConfigType, format = UTC_FORMAT_TIME_STRING) => {
  return dayjs(date).endOf('day').format(format).toString()
}

export const parserDateTime = (dateTime: Date | Dayjs, unit: OpUnitType | undefined = 'day') =>
  dateTime ? dayjs(dateTime).startOf(unit).toISOString() : null
