// import UploadFileImage from 'src/components/Atomic/Form/InputImage'
// import { acceptedImageTypes, imageAccepted } from 'src/constants/file'
import { Form } from 'antd'
import { useState } from 'react'
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
import ModalCreateArtistAccount from './CreateArtistAccount'

const Artists = () => {
  const { showSuccess } = useToast()
  const [formSearch] = Form.useForm<{ q: string }>()
  const {
    isOpen: isArtistDetailModalOpen,
    setOpen: setOpenArtistDetailModal,
    isRender: renderModalDetail,
    setRenderModal: setRenderModalDetail
  } = useModalsHandler()
  const {
    isOpen: isArtistAccountModalOpen,
    setOpen: setOpenArtistAccountModal,
    isRender: renderModalAccount,
    setRenderModal: setRenderModalAccount
  } = useModalsHandler()
  const [artistId, setArtistId] = useState<string | null>(null)
  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteArtist({ vars: { id: value?.toString() } })
    }
  })

  const { pagination, handleOnChange, paginationQueryParams, setTotal, resetCurrent, checkNeedRecall } = usePaging({})
  const handleOpenModalDelete = ({ id }: Vars) => openModalDelete(id)
  const handleOpenModalDetail = ({ id }: Vars) => {
    setRenderModalDetail(true)
    setArtistId(id)
    setOpenArtistDetailModal(true)
  }
  const handleOpenModalAccount = ({ id }: Vars) => {
    setRenderModalAccount(true)
    setArtistId(id)
    setOpenArtistAccountModal(true)
  }

  const handleCancelAccount = () => {
    setOpenArtistAccountModal(false)
    setArtistId(null)
  }

  const handleCancel = () => {
    setOpenArtistDetailModal(false)
    setArtistId(null)
  }
  const handleOk = () => {
    handleFetch()
  }

  const {
    data: listArtists,
    loading,
    refetch: refetchListArtists
  } = useQuery({
    func: Service.getArtists,
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
    refetchListArtists({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: params?.q || formSearch.getFieldValue('q')
    })
  }

  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }
  const { fetch: deleteArtist } = useQuery({
    func: Service.deleteArtist,
    onSuccess: () => {
      showSuccess('Delete artist success')
      closeModalDelete()
      handleOk()
    }
  })

  return (
    <>
      <div className='flex w-full gap-4 mb-16 '>
        <div className='bg-primary-200 w-full p-4 '>
          <div className='bg-black bg-opacity-10 rounded-2xl'>
            <Form form={formSearch} layout='vertical' className='rounded-tl-lg p-2 rounded-tr-lg'>
              <div className='flex justify-between w-[70%] gap-2 items-center'>
                <Form.Item className='flex-1 ' name={'q'}>
                  <TextInput label='Search' onPressEnter={handleSearch} placeholder='Search...' />
                </Form.Item>

                <Button isLoading={loading} onClick={handleSearch} text='Search'></Button>
                <Button
                  text='Create new'
                  onClick={() =>
                    handleOpenModalDetail({
                      id: null as unknown as string
                    })
                  }
                />
              </div>
              {/* <div className='flex justify-end'>
                <LanguageToggle onChange={handleFetch} />
              </div> */}
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              rowKey={'id'}
              dataSource={listArtists?.data}
              pagination={pagination}
              onChange={(_pagination) => {
                handleOnChange(_pagination)
                handleFetch()
              }}
              columns={Column({
                handleOpenModalDelete,
                handleOpenModalDetail,
                handleOpenAccount: handleOpenModalAccount
              })}
            />
          </div>
        </div>
        {renderModalDetail && (
          <ModalDetail
            open={isArtistDetailModalOpen}
            handleOk={handleOk}
            handleCancel={handleCancel}
            modalDetailId={artistId}
            afterClose={() => setRenderModalDetail(false)}
          />
        )}
        {renderModalAccount && (
          <ModalCreateArtistAccount
            open={isArtistAccountModalOpen}
            handleOk={handleOk}
            handleCancel={handleCancelAccount}
            modalDetailId={artistId}
            afterClose={() => setRenderModalAccount(false)}
          />
        )}
      </div>
    </>
  )
}

export default Artists
