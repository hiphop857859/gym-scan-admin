import { Image } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { Category } from 'src/services/category'
import { VarsFunc } from 'src/types'

export interface Props {
  handleOpenModalDelete: VarsFunc
  handleOpenModalDetail: VarsFunc
  // handleOpenModalReject: (args?: any) => void
  // handleOpenModalApprove: (args?: any) => void
}

const Column = ({ handleOpenModalDetail, handleOpenModalDelete }: Props): ColumnType<Category>[] => {
  return [
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
    // {
    //   dataIndex: 'description',
    //   title: 'Description',
    //   align: 'center',
    //   defaultSortOrder: 'descend'
    // },
    {
      dataIndex: 'thumbnail',
      title: 'Image',
      align: 'center',
      render: (value: any) => {
        return <Image width={50} height={50} src={value} />
      }
    }
  ]
}

export default Column
