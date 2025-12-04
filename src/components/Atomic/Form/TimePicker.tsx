import { TimePicker as AntdTimePicker } from 'antd'
import { Dayjs } from 'dayjs'
import React from 'react'
import { rangeTimePicker } from 'src/helpers/ultils'

export interface Props {
  onChange?: (args?: any) => void
  onBlur?: (args?: any) => void
  value?: Dayjs | null | undefined
  placeholder?: string
  style?: React.CSSProperties
  timesDisabled?: number[]
  isFormat?: boolean
}

const TimePicker = ({ onChange, value, placeholder = 'Select Time', style, timesDisabled }: Props) => {
  const disabledTime = () => {
    const [hour, minus, seconds] = timesDisabled ? [...timesDisabled] : [0, 0, 0]
    return () => ({
      disabledHours: () => rangeTimePicker(hour),
      disabledMinutes: () => rangeTimePicker(minus),
      disabledSeconds: () => rangeTimePicker(seconds)
    })
  }

  return (
    <AntdTimePicker
      // format={'HH:mm'}
      showSecond={false}
      style={{ width: '100%', ...style }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabledTime={disabledTime()}
    />
  )
}

export default TimePicker
