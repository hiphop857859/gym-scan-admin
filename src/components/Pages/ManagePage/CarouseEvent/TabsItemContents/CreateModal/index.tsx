import { useCallback, useMemo } from 'react'
import ModalContainer from 'src/components/Containers/ModalContainer'
import variableStyles from 'src/enums/variables.style'
import DebounceSelect from 'src/components/Atomic/Select/DebounceSelect'
import { Service } from 'src/services'
import { useToast } from 'src/Hook/useToast'
import { useQuery } from 'src/Hook/useQuery'
import { CreateCarouselEventPayload } from 'src/services/carouseEvents'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import { Form } from 'antd'
import { EVENT_STATUS } from 'src/services/events'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  open: boolean
  afterClose?: () => void
  createApi: (payload: CreateCarouselEventPayload) => Promise<any>
}

const CreateModal = (props: Props) => {
  const [form] =
    Form.useForm<Partial<{ eventSelected: { key?: string; label: React.ReactNode; value: string | number }[] }>>()

  const { handleCancel, handleOk, open, afterClose, createApi } = props
  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createEvent, loading: loadingCreate } = useQuery({
    func: createApi,
    onSuccess: () => {
      showSuccess('Add events success')
      handleSuccess()
    }
  })

  const loading = loadingCreate

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      const { eventSelected = [] } = values

      createEvent({
        eventIds: eventSelected?.map((o) => '' + o?.value)
      })
    })
  }, [createEvent, form])

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel onClick={handleCancel} />
            <ButtonConfirm isLoading={loading} onClick={handleSubmit} />
          </>
        ]}
      />
    ),
    [handleCancel, handleSubmit, loading]
  )

  return (
    <>
      <ModalContainer
        footer={footer}
        title={'Add event to this carousel'}
        width={variableStyles.modalWidth_normal}
        onCancel={handleCancel}
        isLoading={loading}
        destroyOnClose={true}
        open={open}
        afterClose={afterClose}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <div className='min-h-48'>
          <Form form={form} layout='vertical'>
            <Form.Item
              name='eventSelected'
              label='Search Event'
              rules={[{ required: true, message: 'Please select new event to add to this carousel' }]}
            >
              <DebounceSelect
                mode='multiple'
                placeholder='Search event...'
                fetchOptions={Service.getEvents}
                style={{ width: '100%' }}
                searchParams={{
                  status: EVENT_STATUS.APPROVED
                }}
                normalizeOptionsData={(_, data: any) =>
                  data.data.map((o: any) => ({
                    value: o.id,
                    label: o.name
                  }))
                }
              />
            </Form.Item>
          </Form>
        </div>
      </ModalContainer>
    </>
  )
}

export default CreateModal
