import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { VarsFunc } from 'src/types'
import { formatTimeStartOfDate } from 'src/helpers/time'
import { FORMAT_DATE } from 'src/constants/time'
import { Artist } from 'src/services/artists'
import ButtonIcon from 'src/components/Atomic/Button/ButtonIcon'
import { EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export interface Props {
  handleOpenModalDelete?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  viewOnly?: boolean
  handleOpenAccount?: VarsFunc
}

export const ArtistType = {
  SOLO: 'Solo',
  BAND: 'Band'
}

const Column = ({
  handleOpenModalDetail,
  handleOpenModalDelete,
  viewOnly = false,
  handleOpenAccount
}: Props): ColumnType<Artist>[] => {
  const formatType = (type: string) => {
    switch (type) {
      case ArtistType.SOLO:
        return 'Solo'
      case ArtistType.BAND:
        return 'Band'
      default:
        return ''
    }
  }
  const column: ColumnType<Artist>[] = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      fixed: true,
      width: 50,
      render: (_, record) => {
        return (
          <ButtonsDropDown
            record={record}
            handleDelete={handleOpenModalDelete}
            handleEdit={handleOpenModalDetail}
            handleOpenAccount={record.accountEmail ? undefined : handleOpenAccount}
          />
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
      dataIndex: 'type',
      title: 'Type',
      align: 'center',
      defaultSortOrder: 'descend',
      render: (_, record: any) => {
        return <p>{formatType(record.type)}</p>
      }
    },
    {
      dataIndex: 'dateOfBirth',
      title: 'Date Of birth',
      align: 'center',
      defaultSortOrder: 'descend',
      render: (_, record: any) => {
        return <p>{record.dateOfBirth ? formatTimeStartOfDate(record.dateOfBirth, FORMAT_DATE) : 'Empty'}</p>
      }
    },
    {
      dataIndex: 'occupation',
      title: 'Short Bio',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'draftArtistId',
      title: 'Status verified',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div className='flex items-center justify-center'>
            <p>{record.draftArtistId ? 'Need verified' : 'Verified'}</p>
            {record.draftArtistId ? (
              <Link to={`/artists/profile/${record.draftArtistId}`} rel='noopener noreferrer'>
                <ButtonIcon className='text-[16px]'>
                  <EyeOutlined />
                </ButtonIcon>
              </Link>
            ) : null}
          </div>
        )
      }
    }
  ]

  return viewOnly ? column.filter((item) => item.key !== 'id') : column
}

export default Column
