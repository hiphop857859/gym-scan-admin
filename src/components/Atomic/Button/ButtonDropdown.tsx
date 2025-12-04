import { Dropdown } from 'antd'
import { items, ListActionItem } from '../ItemsTables'
import { PencilSimpleIcon } from 'src/icons/PencilSimpleIcon'

const ButtonsDropDown = ({
  handleDelete,
  handleEdit,
  handleHistory,
  handleApprove,
  handleReject,
  handleViewDetail,
  handleOpenAccount,
  handleResetPassword,
  handleBannedAccount,
  handleUnBannedAccount,
  record,
  label = (
    <span>
      <PencilSimpleIcon />
    </span>
  )
}: ListActionItem<any>) => {
  return (
    <Dropdown
      trigger={['click']}
      className='flex justify-center cursor-pointer'
      menu={{
        items: items({
          handleDelete: handleDelete,
          handleEdit: handleEdit,
          handleHistory: handleHistory,
          handleApprove: handleApprove,
          handleReject: handleReject,
          handleViewDetail: handleViewDetail,
          handleOpenAccount: handleOpenAccount,
          handleResetPassword: handleResetPassword,
          handleBannedAccount: handleBannedAccount,
          handleUnBannedAccount: handleUnBannedAccount,
          record
        })
      }}
      placement='bottomLeft'
    >
      {label}
    </Dropdown>
  )
}

export default ButtonsDropDown
