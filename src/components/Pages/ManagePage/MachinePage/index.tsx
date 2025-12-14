import { Form } from 'antd'
import { useState } from 'react'

import TextInput from 'src/components/Atomic/Form/TextInput'
import Button from 'src/components/Atomic/Button/Button'
import Table from 'src/components/Atomic/Table/Table'

import { useQuery } from 'src/Hook/useQuery'
import usePaging from 'src/Hook/usePagination'
import { Service } from 'src/services'

import ModalDetail from './ModalDetail'
import ModalUpdate from './ModalUpdate'
import ModalCreate from './ModalCreate'
import Column from './Columns'

import { PageParams, Vars } from 'src/types'

const MachinePage = () => {
  const [formSearch] = Form.useForm<{ q: string }>()

  /* ================= MODAL STATE ================= */
  const [modalDetailId, setModalDetailId] = useState<string | null>(null)
  const [modalUpdateId, setModalUpdateId] = useState<string | null>(null)
  const [modalCreateOpen, setModalCreateOpen] = useState<boolean>(false)

  /* ================= MODAL HANDLER ================= */
  const handleOpenModalDetail = ({ id }: Vars) => setModalDetailId(id)
  const handleOpenModalUpdate = ({ id }: Vars) => setModalUpdateId(id)

  const handleCancelDetail = () => setModalDetailId(null)
  const handleCancelUpdate = () => setModalUpdateId(null)
  const handleCancelCreate = () => setModalCreateOpen(false)

  /* ================= PAGINATION ================= */
  const {
    pagination,
    handleOnChange,
    paginationQueryParams,
    setTotal,
    resetCurrent,
    checkNeedRecall
  } = usePaging({})

  /* ================= GET LIST ================= */
  const { data, loading, refetch } = useQuery({
    func: Service.getMachines,
    params: {
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: formSearch.getFieldValue('q'),
      sorts: '-createdAt'
    },
    isQuery: true,
    onSuccess: (res: any) => {
      setTotal(res.total)
      if (checkNeedRecall(res.total)) handleFetch()
    }
  })

  /* ================= FETCH ================= */
  const handleFetch = (params?: PageParams & { sorts?: string }) => {
    refetch({
      limit: paginationQueryParams().pageSize,
      page: paginationQueryParams().pageNumber,
      search: formSearch.getFieldValue('q'),
      sorts: params?.sorts || '-createdAt'
    })
  }

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    resetCurrent()
    handleFetch()
  }

  return (
    <>
      <div className="flex w-full gap-4 mb-16">
        <div className="bg-primary-200 w-full p-4">
          <div className="bg-black bg-opacity-10 rounded-2xl">

            {/* SEARCH */}
            <Form form={formSearch} layout="vertical" className="p-2">
              <div className="flex items-end gap-3">
                {/* SEARCH INPUT */}
                <Form.Item
                  name="q"
                  className="mb-0 w-[300px]"
                >
                  <TextInput
                    label="Search"
                    placeholder="Search machine..."
                    onPressEnter={handleSearch}
                  />
                </Form.Item>

                {/* SEARCH BUTTON */}
                <Button
                  isLoading={loading}
                  onClick={handleSearch}
                  text="Search"
                />

                {/* CREATE BUTTON */}
                <Button
                  type="primary"
                  onClick={() => setModalCreateOpen(true)}
                  text="Create Machine"
                />
              </div>
            </Form>




            {/* TABLE */}
            <Table
              scroll={{ x: 1200 }}
              loading={loading}
              dataSource={data?.data || []}
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
                handleOpenModalUpdate
              })}
              emptyText="No machines found."
            />

          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* DETAIL */}
      {!!modalDetailId && (
        <ModalDetail
          modalDetailId={modalDetailId}
          handleCancel={handleCancelDetail}
          handleOk={handleFetch}
        />
      )}

      {/* UPDATE */}
      {!!modalUpdateId && (
        <ModalUpdate
          modalUpdateId={modalUpdateId}
          handleCancel={handleCancelUpdate}
          handleOk={handleFetch}
        />
      )}

      {/* CREATE */}
      {modalCreateOpen && (
        <ModalCreate
          open={modalCreateOpen}
          handleCancel={handleCancelCreate}
          handleOk={handleFetch}
        />
      )}
    </>
  )
}

export default MachinePage
