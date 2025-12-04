import { Form, Input } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import UploadFileImage from 'src/components/Atomic/Form/InputImage'
import TextInput from 'src/components/Atomic/Form/TextInput'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import { acceptedImageTypes, imageAccepted } from 'src/constants/file'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { CategoryPayload } from 'src/services/category'
import { uploadImage } from 'src/services/upload/service'
import { UploadTypes } from 'src/services/upload'
import { cloneDeep as _cloneDeep } from 'lodash'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [form] = Form.useForm<CategoryPayload>()
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isNew = typeof modalDetailId === 'boolean'

  const titleModal = isNew ? 'Create new category' : 'Category detail'

  const { isFormDirty } = useDirtyForm(form)

  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createCategory, loading: loadingCreate } = useQuery({
    func: Service.createCategory,
    onSuccess: () => {
      showSuccess('Create category success')
      handleSuccess()
    }
  })

  const { fetch: updateCategory, loading: loadingUpdate } = useQuery({
    func: Service.updateCategory,
    onSuccess: () => {
      showSuccess('Update category success')
      handleSuccess()
    }
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getCategory,
    isQuery: !isNew,
    options: {
      noCache: true
    },
    params: {
      id: modalDetailId.toString()
    },
    onSuccess: (_value) => {
      setIsUpdate(true)
      form.setFieldsValue({
        ..._value,
        imageKey: _value.image
      })
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true)
        if (isNew) {
          const imageKey = await uploadImage({
            file: values.imageKey as unknown as File,
            type: UploadTypes.CATEGORY
          })

          if (imageKey) {
            return await createCategory({ description: values.description, name: values.name, imageKey })
          }

          throw new Error('Upload failed')
        } else {
          if ((values.imageKey as any) instanceof File) {
            const imageKey = await uploadImage({
              file: values.imageKey as unknown as File,
              type: UploadTypes.CATEGORY
            })

            if (imageKey) {
              return await updateCategory({
                payload: { description: values.description, name: values.name, imageKey },
                vars: { id: modalDetailId }
              })
            }
          } else {
            const _val: Partial<CategoryPayload> = _cloneDeep(values) || {}
            if (_val.imageKey) delete _val.imageKey

            updateCategory({
              payload: _val,
              vars: { id: modalDetailId }
            })
          }
        }
      })
      .catch(() => {})
  }, [createCategory, form, isNew, modalDetailId, updateCategory])

  const loading = loadingCreate || loadingDetail || loadingUpdate || isLoading

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

            {isNew && (
              <Form.Item name={'imageKey'} rules={[{ required: true }]} label='Photo'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
            {isUpdate && (
              <Form.Item name={'imageKey'} rules={[{ required: true }]} label='Photo'>
                <UploadFileImage
                  listType='picture-circle'
                  accepts={Object.keys(acceptedImageTypes) as Array<imageAccepted>}
                />
              </Form.Item>
            )}
          </Form>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalDetail
