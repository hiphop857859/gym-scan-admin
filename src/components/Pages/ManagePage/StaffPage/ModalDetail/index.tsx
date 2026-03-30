import { Form, message, Tooltip, Switch, Input } from 'antd'
import { useCallback, useMemo, useEffect } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

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
import { UserRole } from 'src/services/user/types'
import { checkIsFormError, getSingerErrorMessage } from 'src/helpers/ultils'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: boolean | string
}

const ModalDetail = ({ handleCancel, modalDetailId, handleOk }: Props) => {
  const [form] = Form.useForm()
  const isNew = typeof modalDetailId === 'boolean'
  const titleModal = isNew ? 'Create new Ambassador' : 'User detail'

  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()

  const referralCode = Form.useWatch('referralCode', form)
  const ambassador = Form.useWatch('ambassador', form)

  useEffect(() => {
    if (isNew) {
      form.resetFields()
      form.setFieldsValue({
        ambassador: true,
        phone: ''
      })
    }
  }, [isNew, form])

  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  // ===== HANDLE ERROR =====
  const handleFormError = (error: any) => {
    const msg = getSingerErrorMessage(error)

    if (msg?.toLowerCase().includes('email')) {
      form.setFields([
        {
          name: 'email',
          errors: ['Email already exists']
        }
      ])
      form.scrollToField('email')
      return
    }

    message.error(msg || 'Failed to save User!')
  }

  // ===== CREATE =====
  const { fetch: createStaff, loading: loadingCreate } = useQuery({
    func: Service.createStaff,
    onSuccess: () => {
      showSuccess('Create user success')
      handleSuccess()
    },
    onError: handleFormError
  })

  // ===== UPDATE =====
  const { fetch: updateStaff, loading: loadingUpdate } = useQuery({
    func: Service.updateStaff,
    onSuccess: () => {
      showSuccess('Update user success')
      handleSuccess()
    },
    onError: handleFormError
  })

  // ===== DETAIL =====
  const { loading: loadingDetail } = useQuery({
    func: Service.getStaff,
    isQuery: !isNew,
    options: { noCache: true },
    params: { id: modalDetailId.toString() },
    onSuccess: (_value) => {
      const parsedPhone = _value.phone
        ? parsePhoneNumberFromString(_value.phone)
        : null

      form.setFieldsValue({
        name: _value.name,
        phone: parsedPhone?.nationalNumber || '',
        email: _value.email,
        appleId: _value.appleId,
        googleId: _value.googleId,
        ambassador: _value.roles?.includes(UserRole.AMBASSADOR_MEMBER),
        status: _value?.isBanned ? 'Banned' : 'Active',
        referralCode: _value.referralCode,
        referralCount: _value.referralCount
      })
    }
  })

  // ===== VALIDATE =====
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
    if (!value) return Promise.reject('Phone number is required')

    const phoneNumber = parsePhoneNumberFromString(`+33${value}`)

    if (!phoneNumber || !phoneNumber.isValid()) {
      return Promise.reject('Invalid phone number')
    }

    return Promise.resolve()
  }

  // ===== SUBMIT =====
  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values) => {
        const phoneNumber = parsePhoneNumberFromString(`+33${values.phone}`)
        const phone = phoneNumber?.format('E.164')

        if (!phone) {
          form.setFields([
            {
              name: 'phone',
              errors: ['Invalid phone number']
            }
          ])
          return
        }

        if (isNew) {
          await createStaff({
            ...values,
            phone,
            ambassador: true
          })
        } else {
          await updateStaff({
            payload: {
              name: values.name,
              phone,
              ambassador: values.ambassador
            },
            vars: { id: modalDetailId }
          })
        }
      })
      .catch((error) => {
        if (checkIsFormError(error)) return
        message.error(getSingerErrorMessage(error))
      })
  }, [createStaff, updateStaff, form, isNew, modalDetailId])

  const loading = loadingCreate || loadingDetail || loadingUpdate

  const footer = useMemo(
    () => (
      <ModalFooterContainer
        array={[
          <>
            <ButtonCancel isModal={isFormDirty} onClick={handleCancel} />
            <ButtonConfirm
              disabled={!isFormDirty}
              isLoading={loading}
              onClick={handleSubmit}
            />
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
      destroyOnClose={false}
    >
      <Form layout="vertical" form={form} autoComplete="off">
        <Form.Item name="referralCode" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="referralCount" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ validator: validateName }]} required>
          <TextInput placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' }
          ]}
        >
          <Input disabled={!isNew} placeholder="example@email.com" />
        </Form.Item>

        {/* 🔥 PHONE GIỮ +33 */}
        <Form.Item name="phone" label="Phone number" rules={[{ validator: validatePhone }]}>
          <Input addonBefore="+33" placeholder="612345678" />
        </Form.Item>

        {isNew && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        )}

        {!isNew && referralCode && (
          <Form.Item label="Referral Code">
            <Input value={referralCode} disabled />
          </Form.Item>
        )}

        {!isNew && ambassador && (
          <Form.Item label="Referral Count">
            <Input value={form.getFieldValue('referralCount')} disabled />
          </Form.Item>
        )}

        {!isNew && (
          <Form.Item name="status" label="Status">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item name="ambassador" label="Ambassador" valuePropName="checked">
          <Switch disabled={isNew} />
        </Form.Item>

        <Tooltip title="Apple ID cannot be changed">
          <Form.Item name="appleId" label="Apple ID">
            <Input disabled />
          </Form.Item>
        </Tooltip>

        <Tooltip title="Google ID cannot be changed">
          <Form.Item name="googleId" label="Google ID">
            <Input disabled />
          </Form.Item>
        </Tooltip>
      </Form>
    </ModalContainer>
  )
}

export default ModalDetail