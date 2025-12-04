import { Form, message, Select, Tooltip, Switch, Input } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import NumberInput from 'src/components/Atomic/Form/NumberInput'
import TextInput from 'src/components/Atomic/Form/TextInput'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { EUserGender, UserRole } from 'src/services/user/types'
import { checkIsFormError, getSingerErrorMessage } from 'src/helpers/ultils'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const [form] = Form.useForm()
  const isNew = typeof modalDetailId === 'boolean'
  const titleModal = isNew ? 'Create new staff' : 'User detail'

  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createStaff, loading: loadingCreate } = useQuery({
    func: Service.createStaff,
    onSuccess: () => {
      showSuccess('Create user success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => setIsLoading(false)
  })

  const { fetch: updateStaff, loading: loadingUpdate } = useQuery({
    func: Service.updateStaff,
    onSuccess: () => {
      showSuccess('Update user success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => setIsLoading(false)
  })

  const { loading: loadingDetail } = useQuery({
    func: Service.getStaff,
    isQuery: !isNew,
    options: { noCache: true },
    params: { id: modalDetailId.toString() },
    onSuccess: (_value) => {


      setIsUpdate(true)
      form.setFieldsValue({
        name: _value.name,
        phone: _value.phone,
        gender: _value.gender,
        age: _value.age,
        email: _value.email,
        appleId: _value.appleId,
        googleId: _value.googleId,
        ambassador: _value.roles?.includes(UserRole.AMBASSADOR_MEMBER),
        status: _value?.isBanned ? 'Banned' : 'Active'
      })
    }
  })

  // Validation rules
  const validateName = (_: any, value: string) => {
    if (!value || !value.trim()) return Promise.reject('Name cannot be empty.')
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{1,100}$/
    if (!regex.test(value)) {
      return Promise.reject(
        'Name must be 1–100 characters, letters/spaces/apostrophes/hyphens only.'
      )
    }
    return Promise.resolve()
  }

  const validatePhone = (_: any, value: string) => {
    if (!value) return Promise.resolve()
    const digits = value.replace(/[^\d]/g, '')
    if (digits.length < 7 || digits.length > 15) {
      return Promise.reject('Phone number must contain 7–15 digits.')
    }
    return Promise.resolve()
  }

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        setIsLoading(true)
        if (isNew) {
          await createStaff(values)
        } else {
          const input = {
            name: values.name,
            phone: values.phone,

            ambassador: values.ambassador
          }
          await updateStaff({ payload: input, vars: { id: modalDetailId } })
        }
      })
      .catch((error) => {
        if (checkIsFormError(error)) return Promise.reject(error)
        message.error(getSingerErrorMessage(error) || 'Failed to save User!')
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
    <ModalContainer
      title={titleModal}
      footer={footer}
      onCancel={handleCancel}
      width={variableStyles.modalWidth_normal}
      isLoading={loading}
      destroyOnClose
    >
      <Form layout="vertical" form={form} className="grid grid-cols-1 gap-1" autoComplete="off">
        {/* Editable fields */}
        <Form.Item name="name" label="Name" rules={[{ validator: validateName }]} required>
          <TextInput placeholder="Name" />
        </Form.Item>

        <Form.Item name="phone" label="Phone number" rules={[{ validator: validatePhone }]}>
          <TextInput placeholder="+1 234 567 890" />
        </Form.Item>


        <Form.Item name="status" label="Status">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="ambassador"
          label="Ambassador"
          valuePropName="checked"
          tooltip="Enable if this user is an ambassador"
        >
          <Switch />
        </Form.Item>

        {/* Read-only fields with tooltip */}
        <Tooltip title="Email cannot be changed">
          <Form.Item name="email" label="Email">
            <Input disabled placeholder="Email" />
          </Form.Item>
        </Tooltip>

        <Tooltip title="Apple ID cannot be changed">
          <Form.Item name="appleId" label="Apple ID">
            <Input disabled placeholder="Apple ID" />
          </Form.Item>
        </Tooltip>

        <Tooltip title="Google ID cannot be changed">
          <Form.Item name="googleId" label="Google ID">
            <Input disabled placeholder="Google ID" />
          </Form.Item>
        </Tooltip>
      </Form>
    </ModalContainer>
  )
}

export default ModalDetail
