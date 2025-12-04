import Table from 'src/components/Atomic/Table/Table'
import { Form } from 'antd'
import { useQuery } from 'src/Hook/useQuery'
import { CarouselEvents, CreateCarouselEventPayload } from 'src/services/carouseEvents'
import usePaging from 'src/Hook/usePagination'
import { AxiosRequestConfig } from 'axios'
import { PageParams, Vars } from 'src/types'
import Column from './Columns'
import Button from 'src/components/Atomic/Button/Button'
import CreateModal from './CreateModal'
import { useModalsHandler } from 'src/Hook/useModalsHandler'
import { useModals } from 'src/Hook/useModalStore'
import { useToast } from 'src/Hook/useToast'

interface TabsItemContentsProps {
  getApi: (params: PageParams, config?: AxiosRequestConfig) => Promise<CarouselEvents>
  createApi: (payload: CreateCarouselEventPayload) => Promise<any>
  deleteApi: (data: { vars: Vars }) => Promise<any>
}

export default function TabsItemContents(props: TabsItemContentsProps) {
  const { getApi, createApi, deleteApi } = props
  const { showSuccess } = useToast()
  const {
    isOpen: isOpenAddModal,
    setOpen: setOpenAddModal,
    isRender: isRenderAddModal,
    setRenderModal: setRenderAddModal
  } = useModalsHandler()

  const [formSearch] = Form.useForm<{ q: string }>()
  const { pagination, handleOnChange, paginationQueryParams, setTotal, checkNeedRecall } = usePaging({})

  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteEvent({ vars: { id: value?.toString() } })
    }
  })

  const { fetch: deleteEvent } = useQuery({
    func: deleteApi,
    onSuccess: () => {
      showSuccess('Carousel item removed successfully.')
      closeModalDelete()
      handleOk()
    }
  })

  const handleOpenModalDelete = ({ id }: Vars) => openModalDelete(id)

  const {
    data: listCarousel,
    loading,
    refetch: refetchCarousel
  } = useQuery<CarouselEvents, PageParams>({
    func: getApi,
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
    refetchCarousel({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: params?.q || formSearch.getFieldValue('q')
    })
  }

  const handleOk = () => {
    handleFetch()
  }

  const openCreateModal = () => {
    setRenderAddModal(true)
    setOpenAddModal(true)
  }

  return (
    <>
      <div className='flex w-full gap-4 mb-16 '>
        <div className='bg-primary-200 w-full p-4 '>
          <div className='w-full flex  justify-end'>
            <div>
              <Button text='Add event to this carousel' onClick={openCreateModal} />
            </div>
          </div>
          <div className='bg-black bg-opacity-10 rounded-2xl'>
            <Form form={formSearch} layout='vertical' className='rounded-tl-lg p-2 rounded-tr-lg'>
              {/* filler */}
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              dataSource={listCarousel?.data}
              pagination={pagination}
              onChange={(_pagination) => {
                handleOnChange(_pagination)
                handleFetch()
              }}
              columns={Column({ handleOpenModalDelete })}
            />
          </div>
        </div>
      </div>

      {isRenderAddModal && (
        <CreateModal
          open={isOpenAddModal}
          handleOk={handleOk}
          handleCancel={() => setOpenAddModal(false)}
          afterClose={() => setRenderAddModal(false)}
          createApi={createApi}
        />
      )}
    </>
  )
}
