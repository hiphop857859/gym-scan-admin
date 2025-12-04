import React from 'react'
import cls from 'classnames'

export type TableColumn<T> = {
  [K in keyof T]: {
    field: K
    headerName: string
    subHeader?: string
    headerClassName?: React.HTMLAttributes<T>['className']
    align?: 'left' | 'right' | 'center'
    minWidth?: number
    cellRenderer?: (value: T[K], row: T, index: number) => React.ReactNode | string
  }
}[keyof T]

interface PaginationProps {
  rowsPerPage?: number
  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPrevPage: () => void
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: Array<T>
  pagination?: PaginationProps
}

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
  // const { currentPage, totalPages, onNextPage, onPrevPage } = pagination || {}

  return (
    <div className='overflow-x-auto relative border-[1px] border-nature-secondary '>
      <table className='w-full text-sm text-left text-gray-400 table-auto border-collapse'>
        <thead className='text-lg text-white text-opacity-30 font-bold capitalize'>
          <tr className='border-0 '>
            {columns.map((column, indexColumn) => (
              <th
                key={column.field as any}
                scope='col'
                className={cls(
                  `py-[1.2rem] bg-primary-300 border-0 border-nature-secondary text-center text-info-main pr-[1rem] ${
                    column.headerClassName || ''
                  }`,
                  {
                    'border-l-2  ': indexColumn !== 0
                  }
                )}
                style={{
                  textAlign: column.align || 'center',
                  minWidth: column.minWidth || 0
                }}
              >
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`text-[1.4rem] font-normal opacity-80 text-white border-0 border-t-2 border-nature-secondary  ${
                index === data.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              {columns.map((column, rowIndex) => {
                const cellValue = row[column.field]
                return (
                  <td
                    key={`${rowIndex}-${String(column.field)}`}
                    className={cls(
                      'py-[1.2rem] text-md border-o border-nature-secondary pr-[1.6rem] whitespace-nowrap',
                      {
                        'border-l-2': rowIndex !== 0
                      }
                    )}
                    style={{
                      textAlign: column.align || 'center',
                      borderBottomLeftRadius: index === data.length - 1 && column === columns[0] ? 10 : 0,
                      borderBottomRightRadius:
                        index === data.length - 1 && column === columns[columns.length - 1] ? 10 : 0
                    }}
                  >
                    {column.cellRenderer ? (column.cellRenderer(cellValue, row, rowIndex) as any) : cellValue}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* {pagination && (
        <div className='flex items-center mt-4 justify-center space-x-[1.2rem]'>
          <IconButton
            onClick={onPrevPage}
            disabled={currentPage === 1}
            style={{ transform: 'rotate(180deg)' }}
            className='text-white disabled:opacity-25 hover:opacity-100'
          >
            <CaretRightRight />
          </IconButton>
          <span className='text-white text-[1.3rem] opacity-50 font-medium'>
            Page {currentPage} sur {totalPages}
          </span>
          <IconButton
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className='text-white disabled:opacity-25 hover:opacity-100'
          >
            <CaretRightRight />
          </IconButton>
        </div>
      )} */}
    </div>
  )
}

export default Table
