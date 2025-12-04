import { Form } from 'antd'
import TextInput from 'src/components/Atomic/Form/TextInput'
import Table from 'src/components/Atomic/Table/Table'
import Column from './Columns'
import ModalDetail from './ModalDetail'
import { useState } from 'react'
import Button from 'src/components/Atomic/Button/Button'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'
import usePaging from 'src/Hook/usePagination'
import { PageParams, Vars } from 'src/types'
import { useModals } from 'src/Hook/useModalStore'
import { useToast } from 'src/Hook/useToast'
import { UserRole } from 'src/services/user/types'

const StaffPage = () => {
  const { showSuccess } = useToast()
  const [formSearch] = Form.useForm<{ q: string }>()
  const [idModalDetail, setIdModalDetail] = useState<string | boolean>('')

  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteStaff({ vars: { id: value?.toString() } })
    }
  })

  const handleOpenModalDelete = ({ id }: Vars) => {
    openModalDelete(id)
  }

  const handleCancel = () => {
    setIdModalDetail(false)
  }

  const handleOk = () => {
    handleFetch()
  }

  const handleOpenModalDetail = ({ id }: Vars) => {
    setIdModalDetail(id)
  }

  const { pagination, handleOnChange, paginationQueryParams, setTotal, resetCurrent, checkNeedRecall } = usePaging({})

  const {
    data: staffs,
    loading,
    refetch
  } = useQuery({
    func: Service.getStaffs,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: formSearch.getFieldValue('q'),
      role: UserRole.FESTIVAL_STAFF
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.meta.totalItems)
      if (checkNeedRecall(data.meta.totalItems)) handleFetch()
    }
  })

  const { fetch: deleteStaff } = useQuery({
    func: Service.deleteStaff,
    onSuccess: () => {
      showSuccess('Delete staff success')
      closeModalDelete()
      handleOk()
    }
  })

  const handleFetch = (params?: PageParams) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: params?.q || formSearch.getFieldValue('q'),
      role: UserRole.FESTIVAL_STAFF
    })
  }

  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }

  return (
    <>
      <div className='flex w-full gap-4 mb-16 '>
        <div className='bg-primary-200 w-full p-4 '>
          <div className='bg-black bg-opacity-10 rounded-2xl'>
            <Form form={formSearch} layout='vertical' className='rounded-tl-lg p-2 rounded-tr-lg'>
              <div className='flex justify-between w-[70%] gap-2 items-center'>
                <Form.Item className='flex-1' name={'q'}>
                  <TextInput label='Search' onPressEnter={handleSearch} placeholder='Search...' />
                </Form.Item>

                <Button isLoading={loading} onClick={handleSearch} text='Search'></Button>
                <Button text='Create new' onClick={() => setIdModalDetail(true)} />
              </div>
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              rowKey={'id'}
              dataSource={staffs?.data}
              pagination={pagination}
              onChange={(_pagination) => {
                handleOnChange(_pagination)
                handleFetch()
              }}
              columns={Column({ handleOpenModalDelete, handleOpenModalDetail })}
            />
          </div>
        </div>

        {!!idModalDetail && (
          <ModalDetail handleOk={handleOk} handleCancel={handleCancel} modalDetailId={idModalDetail} />
        )}
      </div>
    </>
  )
}

export default StaffPage
