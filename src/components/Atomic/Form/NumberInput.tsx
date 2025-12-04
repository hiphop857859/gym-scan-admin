import { InputNumber } from 'antd'
import React from 'react'

export type Props = {
  onChange?: (args?: any) => void
  value?: number | string
  disabled?: boolean
  style?: React.CSSProperties
  prefix?: string
  suffix?: string
  min?: string | number | undefined
  placeholder?: string
  className?: string
}

const NumberInput = ({
  onChange,
  value = 0,
  disabled = false,
  style,
  prefix,
  suffix,
  min,
  placeholder,
  className = ''
}: Props) => (
  <InputNumber
    className={`h-12 outline-4 border-1 text-center  font-medium ${className}`}
    parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : null)}
    maxLength={19}
    style={{ width: '100%', ...style }}
    min={min}
    onChange={onChange}
    value={value}
    disabled={disabled}
    prefix={prefix}
    suffix={suffix || ' '}
    placeholder={placeholder}
    controls={false}
  />
)

export default NumberInput
