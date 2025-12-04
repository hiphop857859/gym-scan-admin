import { Form } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import ButtonCancel from 'src/components/Atomic/Button/ButtonCancel'
import ButtonConfirm from 'src/components/Atomic/Button/ButtonConfirm'
import TextInput from 'src/components/Atomic/Form/TextInput'
import TextInputPass from 'src/components/Atomic/Form/TextInputPassword'
import ModalContainer from 'src/components/Containers/ModalContainer'
import ModalFooterContainer from 'src/components/Containers/ModalFooterContainer'
import variableStyles from 'src/enums/variables.style'
import { useDirtyForm } from 'src/Hook/useDirtyForm'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'

export type Props = {
  handleCancel: () => void
  handleOk?: () => void
  modalDetailId: null | string
  open: boolean
  afterClose?: () => void
}

const ModalCreateArtistAccount = ({ handleCancel, modalDetailId, handleOk, open, afterClose = undefined }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm<{
    email: string
    password: string
    confirmPassword: string
  }>()
  const { isFormDirty } = useDirtyForm(form)
  const { showSuccess } = useToast()
  const handleSuccess = () => {
    handleCancel()
    handleOk && handleOk()
  }

  const { fetch: createArtistAccount, loading: loadingCreate } = useQuery({
    func: Service.createArtistAccount,
    onSuccess: () => {
      showSuccess('Create artist success')
      handleSuccess()
      setIsLoading(false)
    },
    onError: () => {
      setIsLoading(false)
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then(async (values: any) => {
        setIsLoading(true)
        const { email, password } = values

        createArtistAccount({
          vars: { id: modalDetailId as string },
          payload: { email, password }
        })
      })
      .catch(() => { })
  }, [form, createArtistAccount, modalDetailId])

  const loading = loadingCreate || isLoading

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

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter your password')
    }

    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    const isLongEnough = value.length >= 8

    const errors = []
    if (!isLongEnough) errors.push('at least 8 characters')
    if (!hasUpperCase) errors.push('one uppercase letter')
    if (!hasLowerCase) errors.push('one lowercase letter')
    if (!hasNumber) errors.push('one number')
    if (!hasSpecialChar) errors.push('one special character')

    if (errors.length > 0) {
      return Promise.reject(`Password must contain ${errors.join(', ')}`)
    }

    return Promise.resolve()
  }

  return (
    <>
      <ModalContainer
        title={'Create artist account'}
        footer={footer}
        onCancel={handleCancel}
        width={variableStyles.modalWidth_normal}
        isLoading={loading}
        destroyOnClose={true}
        open={open}
        afterClose={afterClose}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <>
          <Form layout='vertical' className='grid grid-cols-1 gap-1 mr-2' autoComplete='off' form={form}>
            <Form.Item name={'email'} rules={[{ type: 'email' }, { required: true }]} label='Email'>
              <TextInput placeholder='Email' className='bg-transparent' />
            </Form.Item>
            <Form.Item name='password' label='Password' rules={[{ validator: validatePassword }]}>
              <TextInputPass placeholder='Enter password' />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              label='Confirm password'
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two passwords do not match'))
                  }
                })
              ]}
            >
              <TextInputPass placeholder='Confirm password' />
            </Form.Item>
          </Form>
        </>
      </ModalContainer>
    </>
  )
}

export default ModalCreateArtistAccount
