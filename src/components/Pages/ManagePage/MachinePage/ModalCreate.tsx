import { Form, Modal, Switch, Upload, message, Button as AntButton, Input } from 'antd'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
    open: boolean
    handleCancel: () => void
    handleOk: () => void
}

const ModalCreate = ({ open, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    /* ================= CREATE ================= */
    const { fetch, loading } = useQuery({
        func: Service.createMachine,
        isQuery: false,
        onSuccess: () => {
            message.success('Create successfully')
            handleOk()
            handleCancel()
            form.resetFields()
            setImageFile(null)
            setVideoFile(null)
        }
    })

    /* ================= DEFAULT isGymMachine = true ================= */
    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                isGymMachine: true
            })
        }
    }, [open, form])

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value ?? '')
        })

        if (imageFile) formData.append('image', imageFile)
        if (videoFile) formData.append('video', videoFile)

        // DEBUG
        console.log('FORM DATA:', [...formData.entries()])

        fetch({
            payload: formData
        })
    }

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            title="Create Machine"
            footer={null}
            width={700}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Machine Name"
                    name="deviceName"
                    rules={[{ required: true, message: 'Required' }]}
                >
                    <TextInput placeholder="Enter machine name" />
                </Form.Item>

                <Form.Item
                    label="Machine Key"
                    name="machineKey"
                    rules={[
                        { required: true, message: 'Required' },
                        {
                            pattern: /^[a-z0-9_]+$/,
                            message: 'Lowercase & underscore only (e.g. may_a1_a2)'
                        }
                    ]}
                >
                    <TextInput placeholder="e.g. may_a1_a2" />
                </Form.Item>

                {/* IMAGE */}
                <Form.Item label="Image">
                    <Upload
                        accept="image/*"
                        beforeUpload={(file) => {
                            setImageFile(file)
                            return false
                        }}
                        showUploadList={{
                            showRemoveIcon: true,
                            onRemove: () => setImageFile(null)
                        }}
                    >
                        <AntButton icon={<UploadOutlined />}>
                            Choose Image
                        </AntButton>
                    </Upload>
                </Form.Item>

                {/* VIDEO */}
                <Form.Item label="Video">
                    <Upload
                        accept="video/*"
                        beforeUpload={(file) => {
                            setVideoFile(file)
                            return false
                        }}
                        showUploadList={{
                            showRemoveIcon: true,
                            onRemove: () => setVideoFile(null)
                        }}
                    >
                        <AntButton icon={<UploadOutlined />}>
                            Choose Video
                        </AntButton>
                    </Upload>
                </Form.Item>

                {/* DEFAULT TRUE */}
                <Form.Item
                    name="isGymMachine"
                    label="Gym Machine"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="instruction"
                    label="Instruction"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter instruction"
                    />
                </Form.Item>

                <div className="flex justify-end gap-3">
                    <AntButton onClick={handleCancel}>
                        Cancel
                    </AntButton>

                    <AntButton
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Create
                    </AntButton>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalCreate
