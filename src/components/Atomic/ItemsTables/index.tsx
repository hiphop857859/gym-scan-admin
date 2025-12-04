import { EditIcon } from 'src/icons/EditIcon'
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  LockOutlined,
  StopOutlined,
  CheckOutlined
} from '@ant-design/icons'
import { Vars, VarsFunc } from 'src/types'

export interface ListActionItem<T> {
  handleDelete?: VarsFunc
  handleEdit?: VarsFunc
  handleHistory?: () => void
  handleApprove?: VarsFunc
  handleReject?: VarsFunc
  handleViewDetail?: VarsFunc
  handleOpenAccount?: VarsFunc
  handleResetPassword?: VarsFunc
  handleBannedAccount?: VarsFunc
  handleUnBannedAccount?: VarsFunc

  label?: React.ReactNode
  record: T
}

export const items = <K extends Vars>({
  handleDelete,
  handleEdit,
  record,
  handleApprove,
  handleReject,
  handleViewDetail,
  handleOpenAccount,
  handleResetPassword,
  handleBannedAccount,
  handleUnBannedAccount
}: ListActionItem<K>) => {
  const actions = []

  if (handleViewDetail) {
    actions.push({
      key: '5',
      label: (
        <p className='flex gap-2 hover:bg-primary-200'>
          <InfoCircleOutlined width={16} />
          View detail
        </p>
      ),
      onClick: () => handleViewDetail({ id: record.id }),
      title: 'View detail'
    })
  }

  if (handleOpenAccount) {
    actions.push({
      key: '6',
      label: (
        <p className='flex gap-2 hover:bg-primary-200'>
          <UserAddOutlined width={16} />
          Create account
        </p>
      ),
      onClick: () => handleOpenAccount({ id: record.id }),
      title: 'Create account'
    })
  }

  if (handleResetPassword) {
    actions.push({
      key: '7',
      label: (
        <p className='flex gap-2 hover:bg-primary-200'>
          <LockOutlined width={16} />
          Reset password
        </p>
      ),
      onClick: () => handleResetPassword({ id: record.id, name: record.name, email: record.email }),
      title: 'Reset password'
    })
  }
  if (handleBannedAccount || handleUnBannedAccount) {
    const isUnban = !!handleUnBannedAccount
    actions.push({
      key: '8',
      label: (
        <p
          className={`flex gap-2 hover:bg-primary-200 ${isUnban ? 'text-green-500' : 'text-red-500'
            }`}
        >
          {isUnban ? <CheckOutlined width={16} /> : <StopOutlined width={16} />}
          {isUnban ? 'Unban account' : 'Ban account'}
        </p>
      ),
      onClick: () =>
        isUnban
          ? handleUnBannedAccount?.({ id: record.id })
          : handleBannedAccount?.({ id: record.id }),
      title: isUnban ? 'Unban account' : 'Ban account'
    })
  }

  if (handleEdit) {
    actions.push({
      key: '2',
      label: (
        <p className='flex gap-2 hover:bg-primary-200'>
          <EditIcon width={16} />
          Edit
        </p>
      ),
      onClick: () => handleEdit({ id: record.id }),
      title: 'Edit'
    })
  }

  if (handleDelete) {
    actions.push({
      key: '1',
      label: (
        <p className='flex text-red-500 gap-2 hover:bg-primary-200'>
          <DeleteOutlined width={16} />
          Delete
        </p>
      ),
      onClick: () => handleDelete({ id: record.id }),
      title: 'Delete'
    })
  }

  if (handleApprove) {
    actions.push({
      key: '3',
      label: (
        <p className='flex text-green-500 gap-2 hover:bg-primary-200'>
          <CheckCircleOutlined width={16} />
          Approve
        </p>
      ),
      onClick: () => handleApprove({ id: record.id }),
      title: 'Approve'
    })
  }

  if (handleReject) {
    actions.push({
      key: '4',
      label: (
        <p className='flex text-red-500 gap-2 hover:bg-primary-200'>
          <CloseOutlined width={16} />
          Reject
        </p>
      ),
      onClick: () => handleReject({ id: record.id }),
      title: 'Reject'
    })
  }

  return actions
}
