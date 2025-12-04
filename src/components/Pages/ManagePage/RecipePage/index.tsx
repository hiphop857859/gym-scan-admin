import { Form } from 'antd'
import { useState } from 'react'
import TextInput from 'src/components/Atomic/Form/TextInput'
import Button from 'src/components/Atomic/Button/Button'
import Select from 'src/components/Atomic/Form/Select'
import Table from 'src/components/Atomic/Table/Table'
import { useQuery } from 'src/Hook/useQuery'
import usePaging from 'src/Hook/usePagination'
import { useToast } from 'src/Hook/useToast'
import { useModals } from 'src/Hook/useModalStore'
import { Service } from 'src/services'
import ModalDetail from './ModalDetail'
import Column from './Columns'
import { PageParams, Vars } from 'src/types'

const RecipePage = () => {
  const { showSuccess } = useToast()
  const [formSearch] = Form.useForm<{ q: string; type: string }>()
  const [modalId, setModalId] = useState<boolean | string>(false)

  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteRecipe({ vars: { id: value.toString() } })
    }
  })

  const handleOpenModalDetail = ({ id }: Vars) => setModalId(id)
  const handleCancelModal = () => setModalId(false)
  const handleOpenModalDelete = ({ id }: Vars) => openModalDelete(id)
  const handleOkModal = () => handleFetch()

  const { pagination, handleOnChange, paginationQueryParams, setTotal, resetCurrent, checkNeedRecall } =
    usePaging({})

  const { data, loading, refetch } = useQuery({
    func: Service.getRecipes,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: formSearch.getFieldValue('q'),
      type: formSearch.getFieldValue('type'),
      sorts: '-createdAt'
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.total)
      if (checkNeedRecall(data.total)) handleFetch()
    }
  })

  const { fetch: deleteRecipe } = useQuery({
    func: Service.deleteRecipe,
    onSuccess: () => {
      showSuccess('Delete recipe success')
      closeModalDelete()
      handleFetch()
    }
  })

  const handleFetch = (params?: PageParams & { sorts?: string }) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: params?.q || formSearch.getFieldValue('q'),
      type: formSearch.getFieldValue('type'),
      sorts: params?.sorts || '-createdAt'
    })
  }

  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }

  return (
    <>
      <div className="flex w-full gap-4 mb-16">
        <div className="bg-primary-200 w-full p-4">
          <div className="bg-black bg-opacity-10 rounded-2xl">
            <Form form={formSearch} layout="vertical" className="p-2">
              <div className="flex w-[70%] gap-3 items-center">
                <Form.Item className="flex-1" name={'q'}>
                  <TextInput label="Search" placeholder="Search recipe..." onPressEnter={handleSearch} />
                </Form.Item>

                <Form.Item className="w-40" name={'type'}>
                  <Select
                    label="Meal Type"
                    data={[
                      { name: 'MEAL', id: 'MEAL' },
                      { name: 'SMOOTHIE', id: 'SMOOTHIE' },
                      { name: 'SNACK / BREAKFAST', id: 'SNACK / BREAKFAST' },
                      { name: 'DESSERT', id: 'DESSERT' }
                    ]}
                    keyItem="id"
                    valueItem="id"
                    placeholder="Type"
                  />
                </Form.Item>

                <Button isLoading={loading} onClick={handleSearch} text="Search" />
                <Button text="Create Recipe" onClick={() => setModalId(true)} />
              </div>
            </Form>

            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              dataSource={data?.items || []}
              pagination={pagination}
              onChange={(_pagination, _filters, sorter) => {
                handleOnChange(_pagination)
                let sorts = '-createdAt'
                if (sorter?.field) {
                  const order = sorter.order === 'ascend' ? '' : '-'
                  sorts = `${order}${sorter.field}`
                }
                handleFetch({ sorts })
              }}
              columns={Column({
                handleOpenModalDetail,
                handleOpenModalDelete
              })}
            />
          </div>
        </div>
      </div>

      {!!modalId && (
        <ModalDetail modalDetailId={modalId} handleCancel={handleCancelModal} handleOk={handleOkModal} />
      )}
    </>
  )
}

export default RecipePage
