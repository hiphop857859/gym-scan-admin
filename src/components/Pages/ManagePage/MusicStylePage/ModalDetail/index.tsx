import { Form, Input } from 'antd'
import { useCallback, useMemo } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextInput from 'src/components/Atomic/Form/TextInput'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { MusicStylePayload } from 'src/services/musicStyle'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [form] = Form.useForm<MusicStylePayload>()
  const {
    isFormDirty
    //  setInitialValues
  } = useDirtyForm(form)
  const isNew = typeof modalDetailId === 'boolean'
  const titleModal = isNew ? 'Create new music style' : 'Music style detail'

  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createMusicStyle, loading: loadingCreate } = useQuery({
    func: Service.createMusicStyle,
    onSuccess: () => {
      showSuccess('Create music style success')
      handleSuccess()
    }
  })

  const { fetch: updateMusicStyle, loading: loadingUpdate } = useQuery({
    func: Service.updateMusicStyle,
    onSuccess: () => {
      showSuccess('Update music style success')
      handleSuccess()
    }
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getMusicStyle,
    isQuery: !isNew,
    options: {
      noCache: true
    },
    params: {
      id: modalDetailId.toString()
    },
    onSuccess: (_value) => {
      form.setFieldsValue(_value)
      // setInitialValues({ description: _value.description, icon: _value.icon, name: _value.name })
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (isNew) {
          createMusicStyle(values)
        } else {
          updateMusicStyle({ payload: values, vars: { id: modalDetailId } })
        }
      })
      .catch(() => {})
  }, [createMusicStyle, form, isNew, modalDetailId, updateMusicStyle])

  const loading = loadingCreate || loadingDetail || loadingUpdate

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel isModal={isFormDirty} onClick={handleCancel} />
            <ButtonConfirm disabled={!isFormDirty} isLoading={loading} onClick={handleSubmit} />
          </>
        ]}
      />
    ),
    [handleCancel, handleSubmit, isFormDirty, loading]
  )

  return (
    <>
      <ModalContainer
        title={titleModal}
        footer={footer}
        onCancel={handleCancel}
        width={variableStyles.modalWidth_normal}
        isLoading={loading}
        destroyOnClose={true}
      >
        <>
          <Form layout='vertical' className='grid grid-cols-1 gap-1' autoComplete='off' form={form}>
            <Form.Item name={'name'} rules={[{ required: true, type: 'string' }]} label='Name'>
              <TextInput placeholder='Name' />
            </Form.Item>
            <Form.Item name={'description'} rules={[{ required: true, type: 'string' }]} label='Description'>
              <Input.TextArea placeholder='Description' rows={4} />
            </Form.Item>
            <Form.Item name={'icon'} rules={[{ required: true, type: 'string' }]} label='Icon'>
              <TextInput placeholder='Input icon...' />
            </Form.Item>
          </Form>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalDetail
