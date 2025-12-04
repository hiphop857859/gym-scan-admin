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
import Select from 'src/components/Atomic/Form/Select'

const StaffPage = () => {
  const { showSuccess } = useToast()
  const [formSearch] = Form.useForm<{ q: string, role: string }>()
  const [idModalDetail, setIdModalDetail] = useState<string | boolean>('')

  const { openModalDelete, closeModalDelete, openModalBanned, openModalUnBanned, closeModalBanned, closeModalUnBanned,
    openModalResetPassword, closeModalResetPassword


  } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteStaff({ vars: { id: value?.toString() } })
    },
    handleModalBannedOk: (value) => {
      value && bannedStaff({ vars: { id: value?.toString() } })
    },
    handleModalUnBannedOk: (value) => {
      value && unBannedStaff({ vars: { id: value?.toString() } })
    },
    handleModalResetPasswordOk: (value) => {
      value && resetPassword({ vars: { id: value?.toString() } })
    }
  })

  const handleOpenModalDelete = ({ id }: Vars) => {
    openModalDelete(id)
  }
  const handleOpenModalBanned = ({ id }: Vars) => {
    openModalBanned(id)
  }
  const handleOpenModalUnBanned = ({ id }: Vars) => {
    openModalUnBanned(id)
  }
  const handleOpenModalResetPassword = ({ id, name, email }: Vars) => {
    openModalResetPassword({ id, name, email })
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
      search: formSearch.getFieldValue('q'),
      role: UserRole.USER,
      sorts: '-createdAt'
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.total)
      if (checkNeedRecall(data.total)) handleFetch()
    }
  })

  // const { data: _routineTypes, loading: loadingRoutineType } = useQuery({
  //   func: Service.getRoutineTypes,
  //   isQuery: true
  // })

  // const routineTypes =
  //   _routineTypes?.data.items.map((item) => ({ id: item.id, name: item.name.en, code: item.id })) || []

  const { fetch: deleteStaff } = useQuery({
    func: Service.deleteStaff,
    onSuccess: () => {
      showSuccess('Delete staff success')
      closeModalDelete()
      handleOk()
    }
  })
  const { fetch: bannedStaff } = useQuery({
    func: Service.bannedStaff,
    onSuccess: () => {
      showSuccess('Banned user success')
      closeModalBanned()
      handleOk()
    }
  })

  const { fetch: unBannedStaff } = useQuery({
    func: Service.unBannedStaff,
    onSuccess: () => {
      showSuccess('unBan user success')
      closeModalUnBanned()
      handleOk()
    }
  })

  const { fetch: resetPassword } = useQuery({
    func: Service.resetPassword,
    onSuccess: () => {
      showSuccess('Password has been reset successfully.')
      closeModalResetPassword()
      handleOk()
    }
  })
  const handleFetch = (params?: PageParams & { sorts?: string }) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: params?.q || formSearch.getFieldValue('q'),
      role: formSearch.getFieldValue('role') || UserRole.USER,
      sorts: params?.sorts || '-createdAt'
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
                <Form.Item className='flex-1 ' name={'q'}>
                  <TextInput label='Search' onPressEnter={handleSearch} placeholder='Search...' />
                </Form.Item>
                <Form.Item className='w-40' name={'role'} >
                  <Select
                    label='Role'
                    data={[
                      { name: 'User', id: '1', code: 'user' },
                      { name: 'Ambassador', id: '2', code: 'ambassador' }
                    ]}
                    keyItem='id'
                    valueItem='id'
                    placeholder="Select Role"
                  />
                </Form.Item>
                <Button isLoading={loading} onClick={handleSearch} text='Search'></Button>
                {/* <Button text='Create new' onClick={() => setIdModalDetail(true)} /> */}
              </div>
              {/* <div className='flex justify-end'>
                <LanguageToggle onChange={handleFetch} />
              </div> */}
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              dataSource={staffs?.items || []}
              pagination={pagination}
              onChange={(_pagination, _filters, sorter) => {
                handleOnChange(_pagination)
                let sorts = '-createdAt' // default

                if (sorter && sorter.field) {
                  const order = sorter.order === 'ascend' ? '' : '-'
                  sorts = `${order}${sorter.field}`
                }

                handleFetch({ sorts })
              }}
              columns={Column({ handleOpenModalBanned, handleOpenModalUnBanned, handleOpenModalDetail, handleOpenModalResetPassword })}
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
