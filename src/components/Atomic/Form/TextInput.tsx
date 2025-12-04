import React, { FocusEventHandler } from 'react'
import { Input } from 'antd'
import { customIsEmpty } from 'src/helpers/ultils'
import Label from './Label'

export type Props = {
  type?: 'text' | 'password'
  value?: string
  onChange?: (...args: any[]) => void
  onClear?: (...args: any[]) => void
  placeholder: string
  name?: string
  label?: string
  disabled?: boolean
  required?: boolean
  className?: string
  onPressEnter?: (...args: any[]) => void
  onBlur?: () => void
  onFocus?: FocusEventHandler<HTMLInputElement>
  autoComplete?: string
}

const CustomInput: React.FC<Props> = ({
  type = 'text',
  value = '',
  onChange,
  // onClear,
  placeholder = '',
  name = '',
  disabled = false,
  required = false,
  className,
  label,
  onPressEnter,
  ...restProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempValue = { ...e }
    if (customIsEmpty(tempValue)) {
      onChange && onChange(e)
    } else {
      onChange && onChange({ ...e, name, value: e.target.value })
    }
  }

  // Common props for both Input and Input.Password
  const inputProps = {
    ...restProps,
    className: `h-10.5 outline-4 border-1 border-primary_border ${className}`,
    onPressEnter,
    onChange: handleChange,
    placeholder,
    name,
    value,
    maxLength: 200,
    disabled
  }

  return (
    <>
      {label && (
        <Label>
          {label} {required && <span className='text-error-500'>*</span>}
        </Label>
      )}
      {type === 'password' ? <Input.Password {...inputProps} /> : <Input {...inputProps} />}
    </>
  )
}

export default CustomInput
