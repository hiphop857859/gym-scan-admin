import { Form, Modal, Upload, message, Button, Input, Row, Col } from 'antd'
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

/** Auto-generate machine key from name */
const generateMachineKey = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
}

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
            form.resetFields()
            setImageFile(null)
            setVideoFile(null)
        }
    }, [open])

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
        // Validate upload
        if (!imageFile) {
            message.error('Image is required')
            return
        }

        if (!videoFile) {
            message.error('Video is required')
            return
        }

        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'instructions' && Array.isArray(value)) {
                value.forEach((item: string, index: number) => {
                    formData.append(`instructions[${index}]`, item)
                })
            } else {
                formData.append(key, value ?? '')
            }
        })

        formData.append('image', imageFile)
        formData.append('video', videoFile)

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
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={(changedValues) => {
                    if (changedValues.deviceName) {
                        form.setFieldsValue({
                            machineKey: generateMachineKey(changedValues.deviceName)
                        })
                    }
                }}
            >
                {/* ================= BASIC INFO ================= */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Machine Name"
                            name="deviceName"
                            rules={[{ required: true, message: 'Machine name is required' }]}
                        >
                            <TextInput />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Machine Key"
                            name="machineKey"
                            rules={[{ required: true, message: 'Machine key is required' }]}
                        >
                            <TextInput disabled />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ================= IMAGE & VIDEO ================= */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Image" required>
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

                    <Col span={12}>
                        <Form.Item label="Video" required>
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

                {/* ================= INSTRUCTIONS ================= */}
                {/* ================= INSTRUCTIONS ================= */}
                <Form.Item
                    label="Instructions"
                    required
                    shouldUpdate
                >
                    {() => {
                        const instructions = form.getFieldValue('instructions')

                        const hasError = !instructions || instructions.length === 0

                        return (
                            <>
                                <Form.List
                                    name="instructions"
                                    rules={[
                                        {
                                            validator: async (_, value) => {
                                                if (!value || value.length === 0) {
                                                    return Promise.reject(
                                                        new Error('At least one instruction is required')
                                                    )
                                                }
                                            }
                                        }
                                    ]}
                                >
                                    {(fields, { add, remove }) => (
                                        <>
                                            <div className="flex justify-between items-center mb-3">
                                                <Button onClick={() => add('')}>+ Add Step</Button>
                                            </div>

                                            {fields.map(({ key, name }, index) => (
                                                <div
                                                    key={key}
                                                    className="relative p-4 mb-3 border rounded-lg
                             bg-[rgba(255,255,255,0.02)]
                             hover:bg-[rgba(255,255,255,0.04)] transition"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(name)}
                                                        className="absolute top-3 right-3 text-red-500"
                                                    >
                                                        ✕
                                                    </button>

                                                    <div className="mb-2 text-sm font-medium text-gray-300">
                                                        Step {index + 1}
                                                    </div>

                                                    <Form.Item
                                                        name={name}
                                                        className="mb-0"
                                                        rules={[
                                                            { required: true, message: 'Instruction is required' }
                                                        ]}
                                                    >
                                                        <Input.TextArea rows={2} />
                                                    </Form.Item>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>

                                {/* Error message for empty list */}
                                {hasError && (
                                    <div className="text-red-500 text-sm mt-1">
                                        Instructions is required
                                    </div>
                                )}
                            </>
                        )
                    }}
                </Form.Item>


                {/* ================= FOOTER ================= */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Create
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalCreate
