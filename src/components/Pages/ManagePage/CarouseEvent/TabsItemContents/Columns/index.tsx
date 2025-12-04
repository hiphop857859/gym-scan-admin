import { Image, Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { CarouselEvent } from 'src/services/carouseEvents'
import { VarsFunc } from 'src/types'
import { EVENT_STATUS } from 'src/services/events/types'
import { EVENT_STATUS_MAPPING_COLOR } from 'src/constants/events'
import { formatTimeByLocal } from 'src/helpers/time'
import { FORMAT_DATE_TIME_12H } from 'src/constants/time'

export interface Props {
  handleOpenModalDelete?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  // handleOpenModalReject: (args?: any) => void
  // handleOpenModalApprove: (args?: any) => void
}

const Column = ({ handleOpenModalDetail, handleOpenModalDelete }: Props): ColumnType<CarouselEvent>[] => {
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
      title: 'Event Name',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'startDate',
      title: 'Start Date',
      align: 'center',
      defaultSortOrder: 'descend',
      render: (_, record) => {
        return <p>{formatTimeByLocal(record.startDate, FORMAT_DATE_TIME_12H)}</p>
      }
    },
    {
      dataIndex: 'location',
      title: 'Location',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'status',
      title: 'Status',
      align: 'center',
      defaultSortOrder: 'descend',
      render: (value: EVENT_STATUS) => {
        return <Tag color={EVENT_STATUS_MAPPING_COLOR[value] ?? 'gold'}>{value}</Tag>
      }
    },
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
