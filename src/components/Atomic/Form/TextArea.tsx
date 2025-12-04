import React from 'react'
import { Input } from 'antd'

const { TextArea: AntdText } = Input

export type Props = {
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  rows?: number
  maxLength?: number
  onChange?: (...args: any[]) => void
  onBlur?: (...args: any[]) => void
  value?: number | string
  alowClear?:
    | boolean
    | {
        clearIcon?: React.ReactNode
      }
    | undefined
}

const TextArea = ({
  value,
  // placeholder = 'Enter Text',
  rows = 3,
  maxLength = 5000,
  onChange,
  onBlur,
  disabled = false,
  alowClear = true
}: Props) => {
  return (
    <AntdText
      className='border border-primary_border'
      allowClear={alowClear}
      placeholder={''}
      rows={rows}
      onChange={onChange}
      onBlur={onBlur}
      maxLength={maxLength}
      style={{ height: 120, resize: 'none' }}
      value={value}
      disabled={disabled}
    />
  )
}

export default TextArea
