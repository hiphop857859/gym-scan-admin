import { Image } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { Partner } from 'src/services/partner'
import { VarsFunc } from 'src/types'

export interface Props {
  handleOpenModalDelete?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  viewOnly?: boolean
}

const Column = ({ handleOpenModalDetail, handleOpenModalDelete, viewOnly = false }: Props): ColumnType<Partner>[] => {
  const column: ColumnType<Partner>[] = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      fixed: true,
      width: 50,
      render: (_, record) => {
        return (
          <ButtonsDropDown record={record} handleDelete={handleOpenModalDelete} handleEdit={handleOpenModalDetail} />
        )
      }
    },
    {
      dataIndex: 'companyName',
      title: 'Company Name',
      align: 'center',
      defaultSortOrder: 'descend',
      width: 200
    },
    {
      dataIndex: 'city',
      title: 'City',
      align: 'center',
      defaultSortOrder: 'descend',
      width: 150
    },
    {
      dataIndex: 'categories',
      title: 'Categories',
      align: 'center',
      defaultSortOrder: 'descend',
      render: (value: any[]) =>
        value
          .flat()
          .map((item) => item.category.name)
          .join(', ')
    },
    {
      dataIndex: 'languagesSpoken',
      title: 'Languages Spoken',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'operationalScope',
      title: 'Operational Scope',
      align: 'center',
      defaultSortOrder: 'descend',
      width: 150
    },
    {
      dataIndex: 'contactEmail',
      title: 'Contact Email',
      align: 'center',
      defaultSortOrder: 'descend',
      width: 150
    },
    {
      dataIndex: 'contactPhoneNumber',
      title: 'Contact Phone',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'logoUrl',
      title: 'Logo',
      align: 'center',
      render: (value: string) => {
        return <Image width={50} height={50} src={value} />
      }
    }
  ]

  return viewOnly ? column.filter((item) => item.key !== 'id') : column
}

export default Column
