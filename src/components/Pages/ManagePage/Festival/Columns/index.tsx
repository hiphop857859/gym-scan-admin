import { Image } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { Staff } from 'src/services/staff'
import { VarsFunc } from 'src/types'

export interface Props {
  handleOpenModalDelete?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  viewOnly?: boolean
  // handleOpenModalReject: (args?: any) => void
  // handleOpenModalApprove: (args?: any) => void
}

const Column = ({ handleOpenModalDetail, handleOpenModalDelete, viewOnly = false }: Props): ColumnType<Staff>[] => {
  const column: ColumnType<Staff>[] = [
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
      dataIndex: 'name',
      title: 'Name',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'email',
      title: 'Email',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'phone',
      title: 'Phone',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    // {
    //   dataIndex: 'address',
    //   title: 'Address',
    //   align: 'center',
    //   defaultSortOrder: 'descend'
    // },
    // {
    //   dataIndex: 'role',
    //   title: 'Role',
    //   align: 'center'
    // },
    {
      dataIndex: 'thumbnail',
      title: 'Image',
      align: 'center',
      render: (value: string) => {
        return <Image width={50} height={50} src={value} />
      }
    }
  ]

  return viewOnly ? column.filter((item) => item.key !== 'id') : column
}

export default Column
