import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { ProfessionalDirectoryPayload } from 'src/services/professional-directory/types'

interface ModalDetailProps {
  modalDetailId: string | boolean
  handleOk: () => void
  handleCancel: () => void
}

const ModalDetail = ({ modalDetailId, handleCancel, handleOk }: ModalDetailProps) => {
  const { showSuccess } = useToast()
  const [formDetail] = Form.useForm<ProfessionalDirectoryPayload>()

  const { loading } = useQuery({
    func: Service.getProfessionalDirectory,
    isQuery: !!modalDetailId && modalDetailId !== true,
    params: {
      id: modalDetailId as string
    },
    onSuccess: (data) => {
      formDetail.setFieldsValue({
        name: data.name,
        companyName: data.companyName,
        description: data.description,
        phoneNumber: data.phoneNumber,
        email: data.email
      })
    }
  })

  const { fetch: createProfessionalDirectory, loading: loadingCreate } = useQuery({
    func: Service.createProfessionalDirectory,
    onSuccess: () => {
      showSuccess('Create professional directory success')
      handleOk()
      onCancel()
    }
  })

  const { fetch: updateProfessionalDirectory, loading: loadingUpdate } = useQuery({
    func: Service.updateProfessionalDirectory,
    onSuccess: () => {
      showSuccess('Update professional directory success')
      handleOk()
      onCancel()
    }
  })

  useEffect(() => {
    if (!modalDetailId) {
      formDetail.resetFields()
    }
  }, [modalDetailId, formDetail])

  const onCancel = () => {
    handleCancel()
  }

  const onFinish = async (value: ProfessionalDirectoryPayload) => {
    const payload = {
      ...value
    }

    if (modalDetailId && modalDetailId !== true) {
      updateProfessionalDirectory({
        vars: { id: modalDetailId as string },
        payload
      })
    } else {
      createProfessionalDirectory(payload)
    }
  }

  return (
    <Modal
      width={700}
      centered
      title={
        modalDetailId && modalDetailId !== true ? 'Update Professional Directory' : 'Create Professional Directory'
      }
      okText={modalDetailId && modalDetailId !== true ? 'Update' : 'Create'}
      open={!!modalDetailId}
      onOk={() => formDetail.submit()}
      okButtonProps={{ loading: loadingCreate || loadingUpdate || loading }}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={formDetail}
        name='professional-directory-detail'
        onFinish={onFinish}
        layout='vertical'
        autoComplete='off'
      >
        <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please enter the name' }]}>
          <TextInput placeholder='Enter name' />
        </Form.Item>
        <Form.Item
          name='companyName'
          label='Company Name'
          rules={[{ required: true, message: 'Please enter the company name' }]}
        >
          <TextInput placeholder='Enter company name' />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Please enter the email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <TextInput placeholder='Enter email' />
        </Form.Item>
        <Form.Item
          name='phoneNumber'
          label='Phone Number'
          rules={[{ required: true, message: 'Please enter the phone number' }]}
        >
          <TextInput placeholder='Enter phone number' />
        </Form.Item>
        <Form.Item
          name='description'
          label='Description'
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea rows={4} placeholder='Enter description' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalDetail
