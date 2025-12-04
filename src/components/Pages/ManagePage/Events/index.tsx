// import UploadFileImage from 'src/components/Atomic/Form/InputImage'
// import { acceptedImageTypes, imageAccepted } from 'src/constants/file'
import './index.css'
import { DatePicker, Form } from 'antd'
import { useState, useEffect } from 'react'
import Button from 'src/components/Atomic/Button/Button'
import Table from 'src/components/Atomic/Table/Table'
import TextInput from 'src/components/Atomic/Form/TextInput'
import Column from './Columns'
import usePaging from 'src/Hook/usePagination'
import { Service } from 'src/services'
import { useQuery } from 'src/Hook/useQuery'
import { useModalsHandler } from 'src/Hook/useModalsHandler'
import { PageParams, Vars } from 'src/types'
import { useModals } from 'src/Hook/useModalStore'
import { useToast } from 'src/Hook/useToast'
import ModalDetail from './ModalDetail'
import { EVENT_STATUS } from 'src/services/events'
import { useAuthStore } from 'src/store'
import { UserRole } from 'src/services/user/types'
import Select from 'src/components/Atomic/Form/Select'
import Spin from 'src/components/Atomic/Spin/Spin'
import { CompletenessStatus } from 'src/services/connectedAccount'
import { useConfirmNavigate } from 'src/Hook/useConfirmNavigate'

interface FilterInterface {
  minPrice: number
  maxPrice: number
  status: string
  createdBy: string
  startDate?: string | null
  endDate?: string | null
}

const EventsPage = () => {
  const { showSuccess } = useToast()
  const [authenticationData] = useAuthStore()
  const [formSearch] = Form.useForm<{ q: string }>()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [allowCreateEvent, setAllowCreateEvent] = useState<boolean>(false)
  const {
    isOpen: isArtistDetailModalOpen,
    setOpen: setOpenArtistDetailModal,
    isRender: renderModalDetail,
    setRenderModal: setRenderModalDetail
  } = useModalsHandler()

  const statusFilterOption = [
    { id: 'All', name: 'All', code: null },
    ...Object.values(EVENT_STATUS).map((status) => ({
      id: status,
      name: status,
      code: status
    }))
  ]

  const createdByFilterOption = [
    { id: 'All', name: 'All', code: null },
    {
      id: UserRole.ADMIN,
      name: 'Admin',
      code: UserRole.ADMIN
    },
    {
      id: UserRole.ASSOCIATION_STAFF,
      name: 'Staff',
      code: UserRole.ASSOCIATION_STAFF
    },
    {
      id: UserRole.FESTIVAL_STAFF,
      name: 'Festival',
      code: UserRole.FESTIVAL_STAFF
    }
  ]

  const [filter, setFilter] = useState<FilterInterface>({
    minPrice: 0,
    maxPrice: 0,
    status: 'All',
    createdBy: 'All',
    startDate: null,
    endDate: null
  })

  const [eventId, setEventId] = useState<string | null>(null)
  const { openModalDelete, closeModalDelete, openModalApprove, closeModalApprove, openModalReject, closeModalReject } =
    useModals({
      handleModalDeleteOk: (value) => {
        value && deleteEvent({ vars: { id: value?.toString() } })
      },
      handleModalApproveOk: (value) => {
        value && approveEventStatus({ vars: { id: value?.toString() }, payload: { status: EVENT_STATUS.APPROVED } })
      },
      handleModalRejectOk: (value) => {
        value && rejectEventStatus({ vars: { id: value?.toString() }, payload: { status: EVENT_STATUS.REJECTED } })
      }
    })

  const { fetch: approveEventStatus } = useQuery({
    func: Service.updateEventStatus,
    onSuccess: () => {
      showSuccess('Approve Event Success')
      closeModalApprove()
      handleOk()
    }
  })

  const { fetch: rejectEventStatus } = useQuery({
    func: Service.updateEventStatus,
    onSuccess: () => {
      showSuccess('Reject Event Success')
      closeModalReject()
      handleOk()
    }
  })
  const { confirmAndNavigate } = useConfirmNavigate(
    '/account-connected',
    'Please finish Connected Account to create event'
  )
  const { pagination, handleOnChange, paginationQueryParams, setTotal, resetCurrent, checkNeedRecall } = usePaging({})
  const handleOpenModalDelete = ({ id }: Vars) => openModalDelete(id)
  const handleOpenModalApprove = ({ id }: Vars) =>
    openModalApprove({
      record: id,
      message: 'Are you sure for APPROVE for this event?'
    })
  const handleOpenModalReject = ({ id }: Vars) =>
    openModalReject({
      record: id,
      message: 'Are you sure for REJECT for this event?',
      needRejectReason: false
    })
  const handleOpenModalDetail = ({ id }: Vars) => {
    if (!allowCreateEvent) {
      return confirmAndNavigate()
    }
    setRenderModalDetail(true)
    setEventId(id)
    setOpenArtistDetailModal(true)
  }

  const handleCancel = () => {
    setOpenArtistDetailModal(false)
    setEventId(null)
  }
  const handleOk = () => {
    handleFetch()
  }

  const {
    data: listEvent,
    loading,
    refetch: refetchListEvents
  } = useQuery({
    func: Service.getEvents,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: formSearch.getFieldValue('q')
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.meta.totalItems)
      if (checkNeedRecall(data.meta.totalItems)) handleFetch()
    }
  })

  const handleFetch = (params?: PageParams) => {
    const filterRecord: Record<string, any> = {}

    if (filter.maxPrice > 0) filterRecord.maxPrice = filter.maxPrice
    if (filter.minPrice) filterRecord.minPrice = filter.minPrice
    if (filter.status !== 'All') filterRecord.status = filter.status
    if (filter.createdBy !== 'All') filterRecord.createdBy = filter.createdBy
    if (filter.startDate) filterRecord.startDate = filter.startDate
    if (filter.endDate) filterRecord.endDate = filter.endDate

    refetchListEvents({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: params?.q || formSearch.getFieldValue('q'),
      ...filterRecord
    })
  }

  const handleModalDetailOk = () => {
    handleOk()
  }

  const { fetch: deleteEvent } = useQuery({
    func: Service.deleteEvent,
    onSuccess: () => {
      showSuccess('Delete event success')
      closeModalDelete()
      handleOk()
    }
  })

  useEffect(() => {
    const checkConnectedAccount = async () => {
      try {
        const res = await Service.checkConnectedAccount()

        setAllowCreateEvent(res?.accountCompleteness === CompletenessStatus.COMPLETED)
      } catch (error) {
        console.error('Error refreshing account connected:', error)

        return
      } finally {
        setIsInitialized(true)
      }
    }
    checkConnectedAccount()
  }, [])

  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }

  if (!isInitialized) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <Spin spinning={true} />
      </div>
    )
  }

  return (
    <>
      <div className='flex w-full gap-4 mb-16 '>
        <div className='bg-primary-200 w-full p-4 '>
          <div className='bg-black bg-opacity-10 rounded-2xl'>
            <Form form={formSearch} layout='vertical' className='rounded-tl-lg p-2 rounded-tr-lg'>
              <div className='flex gap-2 w-[70%]'>
                <Form.Item label='Search' className='flex-1 ' name={'q'}>
                  <TextInput onPressEnter={handleSearch} placeholder='Search...' />
                </Form.Item>

                <div className='pt-[30px]'>
                  <Button isLoading={loading} onClick={handleSearch} text='Search' className='-mb-[5px]'></Button>
                </div>
                <div className='pt-[30px]'>
                  <span>
                    <Button
                      text='Create new'
                      onClick={() =>
                        handleOpenModalDetail({
                          id: null as unknown as string
                        })
                      }
                      className='-mb-[5px]'
                    />
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <Form.Item label='Status' name={'status'}>
                  <Select
                    placeholder='All Status'
                    onChange={(q: string) => {
                      setFilter({
                        ...filter,
                        status: q
                      })
                    }}
                    isLoading={loading}
                    data={statusFilterOption as any}
                    className='h-full w-[200px]'
                  />
                </Form.Item>
                <Form.Item
                  className='w-[250px]'
                  name={'minPrice'}
                  label='Min Price'
                  dependencies={['maxPrice']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const maxPrice = getFieldValue('maxPrice')
                        if ((!value && !maxPrice) || (value && maxPrice)) {
                          if (value && isNaN(value)) {
                            return Promise.reject(new Error('Min Price must be a number.'))
                          }
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('Both Min Price and Max Price must be filled or both must be empty.')
                        )
                      }
                    })
                  ]}
                >
                  <TextInput
                    placeholder='Min price...'
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        minPrice: e.target.value
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item
                  className='w-[250px]'
                  name={'maxPrice'}
                  label='Max Price'
                  dependencies={['minPrice']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const minPrice = getFieldValue('minPrice')
                        if ((!value && !minPrice) || (value && minPrice)) {
                          if (value && isNaN(value)) {
                            return Promise.reject(new Error('Max Price must be a number.'))
                          }
                          return Promise.resolve()
                        }
                        return Promise.reject(
                          new Error('Both Min Price and Max Price must be filled or both must be empty.')
                        )
                      }
                    })
                  ]}
                >
                  <TextInput
                    placeholder='Max price...'
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        maxPrice: e.target.value
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item label='Created By' name={'createdBy'}>
                  <Select
                    placeholder='All Role'
                    onChange={(q: string) => {
                      setFilter({
                        ...filter,
                        createdBy: q
                      })
                    }}
                    data={createdByFilterOption as any}
                    className='h-full w-[300px]'
                  />
                </Form.Item>
                <Form.Item name='startDate' label='Start Date'>
                  <DatePicker
                    className='w-full'
                    placeholder='Start date'
                    onChange={(q: string) => {
                      setFilter({
                        ...filter,
                        startDate: new Date(q).toISOString()
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item name='endDate' label='End Date'>
                  <DatePicker
                    className='w-full'
                    placeholder='End date'
                    onChange={(q: string) => {
                      setFilter({
                        ...filter,
                        endDate: new Date(q).toISOString()
                      })
                    }}
                  />
                </Form.Item>
              </div>

              <div className='flex gap-3 max-w-[70%] items-center'></div>
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              rowKey={'id'}
              dataSource={listEvent?.data}
              pagination={pagination}
              onChange={(_pagination) => {
                handleOnChange(_pagination)
                handleFetch()
              }}
              columns={Column({
                handleOpenModalDelete,
                handleOpenModalDetail,
                handleOpenModalApprove,
                handleOpenModalReject,
                canApprove: authenticationData?.userInfo?.roles?.includes(UserRole.ADMIN),
                canReject: authenticationData?.userInfo?.roles?.includes(UserRole.ADMIN),
                reload: handleFetch,
                authenticationData
              })}
            />
          </div>
        </div>
        {renderModalDetail && (
          <ModalDetail
            open={isArtistDetailModalOpen}
            handleOk={handleModalDetailOk}
            handleCancel={handleCancel}
            modalDetailId={eventId}
            afterClose={() => setRenderModalDetail(false)}
          />
        )}
      </div>
    </>
  )
}

export default EventsPage
