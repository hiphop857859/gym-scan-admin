import React, { useMemo } from 'react'
import { orderListByKey } from 'src/helpers/ultils'
import { Select as AntdSelect } from 'antd'
import Label from './Label'
import { SelectOption } from 'src/types'

const { Option } = AntdSelect

export interface Props<T> {
  data: Array<SelectOption<T>>
  keyItem?: keyof SelectOption<T>
  label?: string
  valueItem?: keyof SelectOption<T>
  placeholder?: string
  renderItem?: (item: SelectOption<T>) => React.ReactNode
  withCodeName?: boolean
  orderBy?: keyof SelectOption<T>
  onChange?: (value: string, item?: SelectOption<T>) => void
  onClear?: () => void
  reverse?: boolean
  children?: React.ReactNode
  CustomSelect?: ({ code, name }: { code: string; name: string }) => JSX.Element
  value?: string
  mode?: 'multiple' | 'tags' | undefined
  isLoading?: boolean
  disabled?: boolean
  autoFocus?: boolean
  allowClear?:
    | boolean
    | {
        clearIcon?: React.ReactNode | ((props: any) => React.ReactNode)
      }
    | undefined
  className?: string
  dropdownRender?: (
    menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>
  tokenSeparators?: string[]
  notFoundContent?: React.ReactNode
  onSearch?: (q: string) => void
  onDropdownVisibleChange?: (open: boolean) => void
}

const Select = <T,>(props: Props<T>) => {
  const {
    data = [],
    keyItem = 'id',
    valueItem = 'id',
    renderItem,
    withCodeName = false,
    orderBy,
    onChange,
    onClear,
    children,
    reverse = false,
    value,
    isLoading = false,
    dropdownRender,
    mode,
    label,
    placeholder,
    className,
    allowClear = true,
    CustomSelect,
    disabled = false,
    tokenSeparators = [],
    ...restProps
  } = props || {}

  const dataOrdered = useMemo(() => {
    if (withCodeName) {
      return orderListByKey(data, 'code', reverse ? 'desc' : 'asc')
    }

    return orderBy ? orderListByKey(data, orderBy, reverse ? 'desc' : 'asc') : data
  }, [data, orderBy, reverse, withCodeName])

  return (
    <>
      {label && <Label>{label}</Label>}
      <AntdSelect
        className={`font-semibold text-primary-500 border-info-main ${className} !min-h-[44px]`}
        showSearch
        tokenSeparators={tokenSeparators}
        allowClear={allowClear}
        onClear={() => {
          onClear && onClear()
        }}
        placeholder={placeholder}
        value={value}
        mode={mode}
        filterOption={(value, option) => {
          return (
            option?.props.children
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(value?.toLowerCase()) >= 0
          )
        }}
        loading={isLoading}
        onChange={(value) => {
          let selectedItem = null
          if (Array.isArray(value)) {
            selectedItem = data.filter((item) => value.includes(item?.[valueItem]))
          } else {
            selectedItem = data.find((item) => item?.[valueItem] === value)
          }
          onChange && onChange(value, selectedItem as any)
        }}
        dropdownRender={dropdownRender}
        disabled={disabled}
        {...restProps}
      >
        {children ||
          dataOrdered.map((item) => (
            <Option key={keyItem ? item[keyItem] : item} value={valueItem ? item[valueItem] : item}>
              {CustomSelect ? (
                <CustomSelect name={item?.name} code={item?.code} />
              ) : renderItem ? (
                renderItem(item)
              ) : withCodeName ? (
                `${item?.code} - ${item?.name}`
              ) : (
                item.name
              )}
            </Option>
          ))}
      </AntdSelect>
    </>
  )
}

export default Select
