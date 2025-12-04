import { useMemo } from 'react'
import { Radio as AntdRadio } from 'antd'
import { orderListByKey } from 'src/helpers/ultils'

export type Props = {
  data: Array<any>
  keyItem?: string
  valueItem?: string
  renderItem?: (item: any) => void
  withCodeName?: boolean
  orderBy?: string
  onChange?: (...args: any[]) => void
  reverse?: boolean
  value?: number | string
  className?: string
  disabled?: boolean
  CustomRadio?: ({ code, name }: { code: string; name: string }) => JSX.Element
}

const RadioGroup = ({
  data = [],
  keyItem = 'id',
  valueItem = 'id',
  renderItem,
  withCodeName = false,
  orderBy = '',
  onChange,
  reverse = false,
  value,
  className,
  disabled = false,
  CustomRadio
}: Props) => {
  const dataOrdered = useMemo(() => {
    if (withCodeName) {
      return orderListByKey(data, 'code', reverse ? 'desc' : 'asc')
    }

    return orderBy ? orderListByKey(data, orderBy, reverse ? 'desc' : 'asc') : data
  }, [data, orderBy, reverse, withCodeName])

  return (
    <AntdRadio.Group
      className={`font-normal ${className}`}
      value={value}
      onChange={(e) => {
        const selectedValue = e.target.value
        const selectedItem = data.find((item) => item?.[valueItem] === selectedValue)
        onChange && onChange(selectedValue, selectedItem)
      }}
      disabled={disabled}
    >
      {dataOrdered.map((item) => (
        <AntdRadio
          className='text-white'
          key={keyItem ? item[keyItem] : item}
          value={valueItem ? item[valueItem] : item}
        >
          {CustomRadio ? (
            <CustomRadio name={item?.name} code={item?.code} />
          ) : renderItem ? (
            renderItem(item)
          ) : withCodeName ? (
            `${item?.code} - ${item?.name}`
          ) : (
            item.name
          )}
        </AntdRadio>
      ))}
    </AntdRadio.Group>
  )
}

export default RadioGroup
