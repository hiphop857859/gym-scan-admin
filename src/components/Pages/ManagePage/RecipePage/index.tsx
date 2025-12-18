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

  /* ================= MODAL ================= */

  const { openModalDelete, closeModalDelete } = useModals({
    handleModalDeleteOk: (value) => {
      value && deleteRecipe({ vars: { id: value.toString() } })
    }
  })

  const handleOpenModalDetail = ({ id }: Vars) => setModalId(id)
  const handleCancelModal = () => setModalId(false)
  const handleOpenModalDelete = ({ id }: Vars) => openModalDelete(id)

  /* ================= PAGING ================= */

  const {
    pagination,
    handleOnChange,
    paginationQueryParams,
    setTotal,
    resetCurrent,
    checkNeedRecall
  } = usePaging({})

  /* ================= LIST ================= */

  const { data, loading, refetch } = useQuery({
    func: Service.getRecipes,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: formSearch.getFieldValue('q'),
      type: formSearch.getFieldValue('type'),
      sorts: '-createdAt' // ✅ CHỈ SORT Ở BACKEND
    },
    isQuery: true,
    onSuccess: (data) => {
      setTotal(data.total)
      if (checkNeedRecall(data.total)) handleFetch()
    }
  })

  /* ================= DELETE ================= */

  const { fetch: deleteRecipe } = useQuery({
    func: Service.deleteRecipe,
    onSuccess: () => {
      showSuccess('Delete recipe success')
      closeModalDelete()
      handleFetch()
    }
  })

  /* ================= FETCH ================= */

  const handleFetch = (params?: PageParams) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: params?.q || formSearch.getFieldValue('q'),
      type: formSearch.getFieldValue('type'),
      sorts: '-createdAt' // ✅ LUÔN GIỮ createdAt DESC
    })
  }

  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }

  const handleOkModal = () => {
    resetCurrent()
    handleFetch()
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="flex w-full gap-4 mb-16">
        <div className="bg-primary-200 w-full p-4">
          <div className="bg-black bg-opacity-10 rounded-2xl">
            <Form form={formSearch} layout="vertical" className="p-2">
              <div className="flex w-[70%] gap-3 items-center">
                <Form.Item className="flex-1" name="q">
                  <TextInput
                    label="Search"
                    placeholder="Search recipe..."
                    onPressEnter={handleSearch}
                  />
                </Form.Item>

                <Form.Item className="w-40" name="type">
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
              rowKey="id"                  // ✅ BẮT BUỘC – CHỐNG NHẢY
              scroll={{ x: 1200 }}
              loading={loading}
              dataSource={data?.items || []}
              pagination={pagination}
              onChange={(pagination) => {
                handleOnChange(pagination)
                handleFetch()
              }}
              columns={Column({
                handleOpenModalDetail,
                handleOpenModalDelete
              })}
              emptyText="No recipes yet. Create your first recipe to feed the AI."
            />
          </div>
        </div>
      </div>

      {!!modalId && (
        <ModalDetail
          modalDetailId={modalId}
          handleCancel={handleCancelModal}
          handleOk={handleOkModal}
        />
      )}
    </>
  )
}

export default RecipePage
