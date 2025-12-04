import { Form, message } from 'antd'
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
import { StaffPayload } from 'src/services/staff'
import { uploadImage } from 'src/services/upload/service'
import { UploadStatus, UploadTypes } from 'src/services/upload/types'
import { UserRole } from 'src/services/user/types'
import GoogleAutocomplete from 'src/components/Atomic/Form/GoogleAutocomplete'
import { OriginalImage } from 'src/Hook/useImageHandler'
import { checkIsFormError, getSingerErrorMessage } from 'src/helpers/ultils'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}
interface StaffPayloadForm extends Omit<StaffPayload, 'imageKey'> {
  imageKey: OriginalImage
}
const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const [form] = Form.useForm<StaffPayloadForm>()
  const isNew = typeof modalDetailId === 'boolean'

  const titleModal = isNew ? 'Create new organizers account' : 'Organizers account detail'

  const { isFormDirty } = useDirtyForm(form)

  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createStaff, loading: loadingCreate } = useQuery({
    func: Service.createStaff,
    onSuccess: () => {
      showSuccess('Create organizers account success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { fetch: updateStaff, loading: loadingUpdate } = useQuery({
    func: Service.updateStaff,
    onSuccess: () => {
      showSuccess('update organizers account success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getStaff,
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
        email: _value.email,
        name: _value.name,
        phone: _value.phone,
        address: _value.address,
        role: _value.role,
        imageKey: {
          uid: _value.image,
          url: _value.image,
          status: UploadStatus.DONE,
          isOriginal: true,
          name: 'Preview'
        }
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
            type: UploadTypes.ADMIN
          })

          if (imageKey) {
            return await createStaff({
              name: values.name,
              email: values.email,
              phone: values.phone,
              address: values.address,
              role: UserRole.FESTIVAL_STAFF,
              imageKey,
              password: values.password
            })
          }

          throw new Error('Upload failed')
        } else {
          let imageKey = null
          if ((values.imageKey as any) instanceof File) {
            imageKey = await uploadImage({
              file: values.imageKey as unknown as File,
              type: UploadTypes.ADMIN
            })

            if (!imageKey) {
              throw new Error('Upload failed')
            }
          }

          return await updateStaff({
            payload: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              address: values.address,
              ...(imageKey ? { imageKey } : {})
            },
            vars: { id: modalDetailId }
          })
        }
      })
      .catch((error: unknown) => {
        if (checkIsFormError(error)) return Promise.reject(error)

        message.error(getSingerErrorMessage(error) || 'Failed to save organizers account')
        return Promise.reject(error)
      })
  }, [createStaff, form, isNew, modalDetailId, updateStaff])

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
            <Form.Item name={'email'} rules={[{ type: 'email' }, { required: true }]} label='Email'>
              <TextInput placeholder='Email' />
            </Form.Item>
            <Form.Item name={'phone'} rules={[{ type: 'string' }]} label='Phone'>
              <TextInput placeholder='Phone' />
            </Form.Item>
            <Form.Item name={'address'} rules={[{ required: true, type: 'string' }]} label='Address'>
              <GoogleAutocomplete />
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
