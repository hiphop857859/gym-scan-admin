import { Empty, Form, Select as SelectAntd, Spin } from 'antd'
import Select from 'src/components/Atomic/Form/Select'
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
import { OperationalScope } from 'src/services/partner'
import { useSearch } from 'src/Hook/useSearch'
import { EventsCategoriesResponseList } from 'src/services/events'

const PartnerPage = () => {
  const { showSuccess } = useToast()
  const [formSearch] = Form.useForm<{ q: string; operationalScopes: string[]; categoryIds: string[] }>()
  const [idModalDetail, setIdModalDetail] = useState<string | boolean>('')

  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deletePartner({ vars: { id: value?.toString() } })
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
    data: partners,
    loading,
    refetch
  } = useQuery({
    func: Service.getPartners,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: formSearch.getFieldValue('q'),
      operationalScopes: undefined as unknown as string[],
      categoryIds: undefined as unknown as string[]
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.meta.totalItems)
      if (checkNeedRecall(data.meta.totalItems)) handleFetch()
    }
  })

  const { fetch: deletePartner } = useQuery({
    func: Service.deletePartner,
    onSuccess: () => {
      showSuccess('Delete partner success')
      closeModalDelete()
      handleOk()
    }
  })

  const {
    triggerSearch: triggerSearchCategory,
    results: category,
    loading: categoryLoading
  } = useSearch({
    func: Service.getEventsCategories,
    normalizationData: (_, data: EventsCategoriesResponseList): EventsCategoriesResponseList => [...data]
  })

  const onSearchCategory = (q: string) => {
    return triggerSearchCategory({ q })
  }

  const handleFetch = (params?: PageParams) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      q: params?.q || formSearch.getFieldValue('q'),
      operationalScopes: formSearch.getFieldValue('operationalScopes'),
      categoryIds: formSearch.getFieldValue('categoryIds')
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
              <div className='flex justify-between gap-2 items-center'>
                <Form.Item className='flex-1 ' name={'q'}>
                  <TextInput label='Search' onPressEnter={handleSearch} placeholder='Search...' />
                </Form.Item>
                <Form.Item className='w-[200px]' name={'operationalScopes'} label='Operational Scope'>
                  <SelectAntd
                    mode='multiple'
                    allowClear
                    placeholder='Please select'
                    style={{ width: '100%' }}
                    options={Object.values(OperationalScope).map((item) => ({ label: item, value: item }))}
                  />
                </Form.Item>
                <Form.Item name='categoryIds' label='Event Category' className='w-[200px]'>
                  <Select
                    className='multiple'
                    mode='multiple'
                    tokenSeparators={[',']}
                    placeholder='Event Category'
                    onSearch={onSearchCategory}
                    onDropdownVisibleChange={(isOpen) => {
                      isOpen && category ? onSearchCategory('') : () => {}
                    }}
                    isLoading={categoryLoading}
                    notFoundContent={
                      categoryLoading ? (
                        // eslint-disable-next-line react/no-children-prop
                        <Spin spinning={categoryLoading} children={<div>loading</div>} />
                      ) : (
                        <Empty />
                      )
                    }
                    data={
                      category.map((c) => ({
                        id: c.id,
                        name: c.name,
                        code: c.id
                      })) ?? []
                    }
                  />
                </Form.Item>

                <Button isLoading={loading} onClick={handleSearch} text='Search'></Button>
                <Button text='Create new' onClick={() => setIdModalDetail(true)} />
              </div>
            </Form>
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              rowKey={'id'}
              dataSource={partners?.data}
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

export default PartnerPage
