import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { MusicStyle } from 'src/services/musicStyle'
import { VarsFunc } from 'src/types'

export interface Props {
  handleOpenModalDelete: VarsFunc
  handleOpenModalDetail: VarsFunc
  // handleOpenModalReject: (args?: any) => void
  // handleOpenModalApprove: (args?: any) => void
}

const Column = ({ handleOpenModalDetail, handleOpenModalDelete }: Props): ColumnType<MusicStyle>[] => {
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
    {
      dataIndex: 'description',
      title: 'Description',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'icon',
      title: 'Icon',
      align: 'center',
      defaultSortOrder: 'descend'
    }
  ]
}

export default Column
