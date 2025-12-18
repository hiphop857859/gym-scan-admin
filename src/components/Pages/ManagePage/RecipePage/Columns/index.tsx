import { Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import dayjs from 'dayjs'

export interface Props {
  handleOpenModalDetail?: (params: any) => void
  handleOpenModalDelete?: (params: any) => void
}

const Columns = ({ handleOpenModalDetail, handleOpenModalDelete }: Props): ColumnType<any>[] => {
  return [
    {
      title: '',
      dataIndex: 'id',
      width: 50,
      fixed: 'left',
      render: (_, record) => (
        <ButtonsDropDown
          record={record}
          handleEdit={handleOpenModalDetail}
          handleBannedAccount={undefined}
          handleUnBannedAccount={undefined}
          handleResetPassword={undefined}
          handleDelete={handleOpenModalDelete}
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'kcal',
      dataIndex: 'kcal'
    },
    // {
    //   title: 'Tags',
    //   dataIndex: 'tags',
    //   render: (tags: string[]) => tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)
    // },
    {
      title: 'Source',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      align: 'center',
      render: (value: boolean) =>
        value ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag color="green">AI</Tag>
        )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      sorter: true,
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm')
    }
  ]
}

export default Columns
