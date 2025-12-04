import { CloseCircleFilled } from '@ant-design/icons'
import React, { useMemo } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import DatePicker from '../Custom/DatePicker'
import { parserDateTime } from 'src/helpers/time'

export interface Props {
  value?: [Dayjs, Dayjs]
  stringValue?: boolean
  onChange?: (...agrs: any[]) => void
  onBlur?: (...agrs: any[]) => void
  keyPressEnter?: (...agrs: any[]) => void
  picker?: 'date' | 'date_time' | 'year'
  dateObject?: boolean
  isStartDay?: boolean
  style?: object
  disabledDate?: (moment: Dayjs) => boolean
  suffixIcon?: React.ReactNode
  clearIcon?: React.ReactNode
  showTime?: boolean
}

const DateRangePicker = ({
  isStartDay = false,
  keyPressEnter,
  value,
  onChange,
  onBlur,
  picker = 'date',
  style,
  disabledDate,
  suffixIcon,
  showTime,
  clearIcon = <CloseCircleFilled />
}: Props) => {
  const format = useMemo(() => {
    switch (picker) {
      case 'year':
        return 'yyyy'

      case 'date_time':
        return 'DD/MM/YYYY HH:mm'
      default:
        return 'DD/MM/YYYY'
    }
  }, [picker])

  return (
    <DatePicker.RangePicker
      allowClear
      value={value && value[0] && value[1] && [dayjs(value[0]), dayjs(value[1])]}
      onChange={(value) => {
        if (!onChange) {
          return
        }
        if (isStartDay && onChange) {
          value && value[0] && value[1]
            ? onChange([parserDateTime(value[0]), parserDateTime(value[1])])
            : onChange(value)
        } else onChange(value)
      }}
      disabledDate={disabledDate}
      format={format}
      className='h-11 outline-4 border-1  font-medium'
      showTime={showTime}
      style={{ width: '100%', ...style }}
      onKeyDown={keyPressEnter}
      suffixIcon={suffixIcon}
      clearIcon={clearIcon}
      onBlur={onBlur}
    />
  )
}

export default DateRangePicker
