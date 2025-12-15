import { Form, Modal, Switch, Upload, message, Button, Input, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
    modalUpdateId: string | null
    handleCancel: () => void
    handleOk: () => void
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const ModalUpdate = ({ modalUpdateId, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    const { data } = useQuery({
        func: Service.getMachineDetail,
        params: modalUpdateId,
        isQuery: !!modalUpdateId
    })

    const { fetch, loading } = useQuery({
        func: Service.updateMachine,
        isQuery: false,
        onSuccess: () => {
            message.success('Update successfully')
            handleOk()
            handleCancel()
        }
    })

    useEffect(() => {
        if (!data) return

        form.setFieldsValue({
            deviceName: data.deviceName,
            machineKey: data.machineKey,
            isGymMachine: data.isGymMachine,
            instruction: data.instruction
        })

        setImageFile(null)
        setVideoFile(null)
    }, [data])

    const handleSubmit = (values: any) => {
        if (!modalUpdateId) return

        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value ?? '')
        })

        if (imageFile) formData.append('image', imageFile)
        if (videoFile) formData.append('video', videoFile)

        fetch({ id: modalUpdateId, payload: formData })
    }

    return (
        <Modal
            open={!!modalUpdateId}
            title="Update Machine"
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Machine Name" name="deviceName" rules={[{ required: true }]}>
                            <TextInput />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Machine Key" name="machineKey" rules={[{ required: true }]}>
                            <TextInput />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
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

                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    className="w-40 h-40 object-cover rounded-lg mt-3"
                                />
                            ) : (
                                data?.imageNewUrl && (
                                    <img
                                        src={data.imageNewUrl}
                                        className="w-40 h-40 object-cover rounded-lg mt-3"
                                    />
                                )
                            )}
                        </Form.Item>
                    </Col>

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

                            {videoFile ? (
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full rounded-lg mt-3"
                                />
                            ) : (
                                data?.videoNewUrl && (
                                    <video
                                        src={data.videoNewUrl}
                                        controls
                                        className="w-full rounded-lg mt-3"
                                    />
                                )
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="isGymMachine" label="Gym Machine" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item name="instruction" label="Instruction">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <div className="flex justify-end gap-3">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalUpdate
