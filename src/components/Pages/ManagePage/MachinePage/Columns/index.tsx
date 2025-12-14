import { Tag } from 'antd'
import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import dayjs from 'dayjs'

export interface Props {
  handleOpenModalDetail?: (params: any) => void
  handleOpenModalUpdate?: (params: any) => void
}

const Columns = ({
  handleOpenModalDetail,
  handleOpenModalUpdate
}: Props): ColumnType<any>[] => {
  return [
    {
      title: '',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      render: (_, record) => {
        return (
          <ButtonsDropDown
            record={record}

            // 👁 VIEW DETAIL
            handleEdit={handleOpenModalUpdate}


            handleViewDetail={handleOpenModalDetail}

          />
        )
      }
    },

    {
      title: 'Machine Name',
      dataIndex: 'deviceName',
      sorter: true
    },

    {
      title: 'Machine Key',
      dataIndex: 'machineKey'
    },

    {
      title: 'Image',
      dataIndex: 'imageNewUrl',
      width: 120,
      render: (img) =>
        img ? (
          <img src={img} className="w-20 h-20 object-cover rounded-xl" />
        ) : (
          <Tag>NO IMAGE</Tag>
        )
    },

    {
      title: 'Video',
      dataIndex: 'videoNewUrl',
      width: 120,
      render: (video) =>
        video ? (
          <a href={video} target="_blank">
            <Tag color="blue">View Video</Tag>
          </a>
        ) : (
          <Tag>NO VIDEO</Tag>
        )
    },

    {
      title: 'Type',
      dataIndex: 'isGymMachine',
      render: (value) =>
        value ? <Tag color="blue">Gym Machine</Tag> : <Tag color="green">Free Weight</Tag>
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: true,
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm')
    }
  ]
}

export default Columns
