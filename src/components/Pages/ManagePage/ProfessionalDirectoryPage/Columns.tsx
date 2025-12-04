import { ColumnsType } from 'antd/es/table'
import { ProfessionalDirectory } from 'src/services/professional-directory/types'
import { EditIcon } from 'src/icons/EditIcon'
import { Trash4Icon } from 'src/icons/Trash4Icon'
import { UserRole } from 'src/services/user/types'
import { useAuthStore } from 'src/store'

interface ColumnProps {
  handleOpenModalDelete: ({ id }: { id: string }) => void
  handleOpenModalDetail: ({ id }: { id: string }) => void
}

const Column = ({ handleOpenModalDelete, handleOpenModalDetail }: ColumnProps) => {
  const [authData] = useAuthStore()
  const userRoles = authData?.userInfo?.roles || []
  const isAdmin = userRoles.includes(UserRole.ADMIN)

  const columns: ColumnsType<ProfessionalDirectory> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left'
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 250
    }
  ]

  // Only show actions column for admins
  if (isAdmin) {
    columns.push({
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <div className='flex gap-4 items-center'>
          <EditIcon
            onClick={() => handleOpenModalDetail({ id: record.id })}
            className='cursor-pointer'
            size={24}
            color={'#fff'}
          />
          <Trash4Icon
            onClick={() => handleOpenModalDelete({ id: record.id })}
            className='cursor-pointer'
            size={24}
            color={'#fff'}
          />
        </div>
      )
    })
  }

  return columns
}

export default Column
