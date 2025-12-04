import { Image, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import Label from 'src/components/Atomic/Form/Label'
import { Staff } from 'src/services/staff'
import { VarsFunc } from 'src/types'
import dayjs from 'dayjs'

export interface Props {
  handleOpenModalBanned?: VarsFunc
  handleOpenModalUnBanned?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  handleOpenModalResetPassword?: VarsFunc
  viewOnly?: boolean
}

const Column = ({
  handleOpenModalDetail,
  handleOpenModalBanned,
  handleOpenModalUnBanned,
  handleOpenModalResetPassword,
  viewOnly = false
}: Props): ColumnType<Staff>[] => {
  const column: ColumnType<Staff>[] = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      fixed: true,
      width: 50,
      render: (_, record) => {
        const isBanned = record.isBanned === true

        return (
          <ButtonsDropDown
            record={record}
            handleEdit={handleOpenModalDetail}
            // if isBanned true -> show Unban action, else -> Ban action
            handleBannedAccount={isBanned ? undefined : handleOpenModalBanned}
            handleUnBannedAccount={isBanned ? handleOpenModalUnBanned : undefined}
            handleResetPassword={handleOpenModalResetPassword}
          />
        )
      }
    },
    {
      dataIndex: 'name',
      title: 'Name',
      align: 'center',
      sorter: true
    },
    {
      dataIndex: 'phone',
      title: 'Phone',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'age',
      title: 'Age',
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
      dataIndex: 'gender',
      title: 'Gender',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'isBanned',
      title: 'Status',
      align: 'center',
      render: (value: boolean) => {
        return value ? (
          <Tag color="red">Banned</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        )
      }
    },
    {
      dataIndex: 'roles',
      title: 'Role',
      align: 'center',
      render: (value: number[]) => {
        const rolesUser: Record<number, string> = {
          1: 'User',
          2: 'Ambassador',
          99: 'Admin'
        }

        return (
          <>
            {value.map((role, i) => (
              <Label key={i}>{rolesUser[role]}</Label>
            ))}
          </>
        )
      }
    },
    {
      dataIndex: 'createdAt',
      title: 'Created Date',
      align: 'center',
      sorter: true,
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm')
    },
  ]

  return viewOnly ? column.filter((item) => item.key !== 'id') : column
}

export default Column
