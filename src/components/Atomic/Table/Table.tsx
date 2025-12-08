import { Divider, Table as TableAntd } from 'antd'
import { ExpandableConfig, GetRowKey } from 'antd/es/table/interface'
import React from 'react'
import { CirclesFourIcon } from 'src/icons/CirclesFourIcon'

export type Props = {
  id?: any
  dataSource?: Array<object>
  columns?: Array<object>
  onChange?: (...args: any[]) => void
  onRow?: any
  pagination?: object
  loading?: boolean
  className?: string
  expandable?: ExpandableConfig<any> | undefined
  isDoubleClick?: boolean
  orderBy?: string
  title?: string
  scroll:
  | ({
    x?: string | number | true | undefined
    y?: string | number | undefined
  } & {
    scrollToFirstRowOnChange?: boolean | undefined
  })
  | undefined
  border?: boolean

  style?: React.CSSProperties
  rowSelection?: object
  component?: object | undefined
  rowKey?: string | GetRowKey<any> | undefined
  emptyText?: string
}

const Table = ({
  id,
  dataSource = [],
  onRow,
  columns = [],
  onChange = () => { },
  pagination = {},
  loading = false,
  expandable,
  style = {},
  scroll,
  title,
  border = true,
  component = {},
  rowKey,
  emptyText = 'No data'
}: Props) => {
  return (
    <>
      {title && <Divider>{title}</Divider>}
      <TableAntd
        showHeader
        className='cursor-pointer'
        id={id}
        rowKey={rowKey}
        style={style}
        locale={{ emptyText: emptyText }}
        columns={columns}
        dataSource={dataSource}
        onRow={onRow}
        sticky
        onChange={onChange}
        bordered={border}
        loading={{ indicator: <CirclesFourIcon color='#1668dc' className='animate-spin  ' />, spinning: loading }}
        expandable={expandable}
        pagination={{
          ...pagination,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`
        }}
        scroll={scroll}
        components={component}
      />
    </>
  )
}

export default Table
