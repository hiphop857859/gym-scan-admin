import { ColumnType } from 'antd/es/table'
import ButtonsDropDown from 'src/components/Atomic/Button/ButtonDropdown'
import { Event } from 'src/services/events'
import { VarsFunc } from 'src/types'
import { formatTimeByLocal } from 'src/helpers/time'
import { Image, Tag, Button, message, Modal } from 'antd'
import { FORMAT_DATE_TIME_12H } from 'src/constants/time'
import { EVENT_STATUS_MAPPING_COLOR } from 'src/constants/events'
import { EVENT_STATUS } from 'src/services/events/types'
import { API } from 'src/services/api.service'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import styles from './styles.module.css'
import { UserRole } from 'src/services/user'
import { IAuthData } from 'src/store'

interface Props {
  handleOpenModalDelete?: VarsFunc
  handleOpenModalDetail?: VarsFunc
  viewOnly?: boolean
  handleOpenModalReject?: (args?: any) => void
  handleOpenModalApprove?: (args?: any) => void
  canApprove?: boolean
  canReject?: boolean
  reload?: () => void
  authenticationData?: IAuthData
}

const Column = ({
  handleOpenModalDetail,
  handleOpenModalDelete,
  viewOnly = false,
  handleOpenModalReject,
  handleOpenModalApprove,
  canApprove = false,
  canReject = false,
  reload,
  authenticationData
}: Props): ColumnType<Partial<Event>>[] => {
  const handleAddCarousel = async (record: Partial<Event>) => {
    try {
      await API.POST(API.addCarouselEvent, {
        vars: {},
        payload: { eventId: record.id }
      })
      message.success('Event added to carousel successfully')
      reload?.()
    } catch (error) {
      message.error('Failed to add event to carousel')
    }
  }

  const handleRemoveCarousel = async (record: Partial<Event>) => {
    try {
      await API.DELETE(API.removeCarouselEvent, {
        vars: { id: record.id }
      })
      message.success('Event removed from carousel successfully')
      reload?.()
    } catch (error) {
      message.error('Failed to remove event from carousel')
    }
  }

  const showAddConfirm = (record: Partial<Event>) => {
    Modal.confirm({
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusOutlined style={{ color: '#1668dc', fontSize: '20px' }} />
          <span>Add to Carousel</span>
        </div>
      ),
      icon: null,
      content: (
        <div style={{ padding: '8px 0' }}>
          <p>Are you sure you want to add this event to the carousel?</p>
        </div>
      ),
      okText: 'Yes, Add',
      cancelText: 'Cancel',
      okButtonProps: {
        style: {
          background: 'linear-gradient(135deg, #1668dc 0%, #1668dc 100%)',
          border: 'none',
          height: '36px',
          padding: '0 20px',
          borderRadius: '6px',
          fontWeight: 500
        }
      },
      cancelButtonProps: {
        style: {
          height: '36px',
          padding: '0 20px',
          borderRadius: '6px',
          fontWeight: 500
        }
      },
      onOk: () => handleAddCarousel(record)
    })
  }

  const showRemoveConfirm = (record: Partial<Event>) => {
    Modal.confirm({
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MinusOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
          <span>Remove from Carousel</span>
        </div>
      ),
      icon: null,
      content: (
        <div style={{ padding: '8px 0' }}>
          <p>Are you sure you want to remove this event from the carousel?</p>
        </div>
      ),
      okText: 'Yes, Remove',
      cancelText: 'Cancel',
      okButtonProps: {
        style: {
          background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
          border: 'none',
          height: '36px',
          padding: '0 20px',
          borderRadius: '6px',
          fontWeight: 500
        }
      },
      cancelButtonProps: {
        style: {
          height: '36px',
          padding: '0 20px',
          borderRadius: '6px',
          fontWeight: 500
        }
      },
      onOk: () => handleRemoveCarousel(record)
    })
  }

  const column: ColumnType<Partial<Event>>[] = [
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      fixed: true,
      width: 80,
      render: (_, record) => {
        const actionsProp = {
          handleDelete: handleOpenModalDelete,
          handleEdit: handleOpenModalDetail
        }

        if (record.status === EVENT_STATUS.PENDING) {
          if (canApprove) {
            Object.assign(actionsProp, {
              handleApprove: handleOpenModalApprove
            })
          }
          if (canReject) {
            Object.assign(actionsProp, {
              handleReject: handleOpenModalReject
            })
          }
        }

        return <ButtonsDropDown record={record} {...actionsProp} />
      }
    },
    {
      dataIndex: 'name',
      title: 'Name',
      align: 'center',
      defaultSortOrder: 'descend'
    },
    {
      dataIndex: 'startDate',
      title: 'Start date',
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
      dataIndex: 'thumbnail',
      title: 'Image',
      align: 'center',
      render: (value: any) => {
        return <Image width={50} height={50} src={value} />
      }
    },
    {
      dataIndex: 'status',
      title: 'Status',
      align: 'center',
      width: 150,
      render: (value: EVENT_STATUS) => {
        return <Tag color={EVENT_STATUS_MAPPING_COLOR[value] ?? 'gold'}>{value}</Tag>
      }
    }
  ]

  const checkRoleAdmin = authenticationData?.userInfo?.roles?.includes(UserRole.ADMIN)

  if (checkRoleAdmin) {
    column.push({
      title: 'Carousel',
      dataIndex: 'id',
      key: 'carousel',
      align: 'center',
      width: 200,
      render: (_, record) => {
        if (record.status !== EVENT_STATUS.APPROVED) {
          return <span className={styles.noActionText}>No action Carousel</span>
        }

        return (
          <div className={styles.buttonContainer}>
            {!record.carouselEventId ? (
              <Button
                type='primary'
                onClick={() => showAddConfirm(record)}
                icon={<PlusOutlined />}
                className={styles.addButton}
              >
                Add Carousel
              </Button>
            ) : (
              <Button
                danger
                onClick={() => showRemoveConfirm(record)}
                icon={<MinusOutlined />}
                className={styles.removeButton}
              >
                Remove Carousel
              </Button>
            )}
          </div>
        )
      }
    })
  }

  return viewOnly ? column.filter((item) => item.key !== 'id') : column
}

export default Column
