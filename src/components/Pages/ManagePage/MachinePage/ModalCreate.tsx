import { Form, Modal, Switch, Upload, message, Button, Input, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
    open: boolean
    handleCancel: () => void
    handleOk: () => void
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const ModalCreate = ({ open, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

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

    useEffect(() => {
        if (open) {
            form.setFieldsValue({ isGymMachine: true })
        }
    }, [open])

    const handleSubmit = (values: any) => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value ?? '')
        })

        if (imageFile) formData.append('image', imageFile)
        if (videoFile) formData.append('video', videoFile)

        fetch({ payload: formData })
    }

    return (
        <Modal
            open={open}
            title="Create Machine"
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Machine Name"
                            name="deviceName"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <TextInput />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Machine Key"
                            name="machineKey"
                            rules={[
                                { required: true },
                                { pattern: /^[a-z0-9_]+$/, message: 'Lowercase & underscore only' }
                            ]}
                        >
                            <TextInput />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* IMAGE */}
                    <Col span={12}>
                        <Form.Item label="Image">
                            <Upload
                                accept={IMAGE_TYPES.join(',')}
                                maxCount={1}
                                beforeUpload={(file) => {
                                    if (!IMAGE_TYPES.includes(file.type)) {
                                        message.error('Only jpeg, jpg, png, webp allowed')
                                        return Upload.LIST_IGNORE
                                    }
                                    setImageFile(file)
                                    return false
                                }}
                                onRemove={() => setImageFile(null)}
                            >
                                <Button icon={<UploadOutlined />}>Choose Image</Button>
                            </Upload>

                            {imageFile && (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    className="w-40 h-40 object-cover rounded-lg mt-3"
                                />
                            )}
                        </Form.Item>
                    </Col>

                    {/* VIDEO */}
                    <Col span={12}>
                        <Form.Item label="Video">
                            <Upload
                                accept="video/*"
                                maxCount={1}
                                beforeUpload={(file) => {
                                    setVideoFile(file)
                                    return false
                                }}
                                onRemove={() => setVideoFile(null)}
                            >
                                <Button icon={<UploadOutlined />}>Choose Video</Button>
                            </Upload>

                            {videoFile && (
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full rounded-lg mt-3"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item name="instruction" label="Instruction">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <div className="flex justify-end gap-3">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalCreate
