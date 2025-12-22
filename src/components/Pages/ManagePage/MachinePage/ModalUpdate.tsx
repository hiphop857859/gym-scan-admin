import { Form, Modal, Upload, message, Button, Input, Row, Col } from 'antd'
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

const generateMachineKey = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
}

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

    /* ================= LOAD DETAIL ================= */
    useEffect(() => {
        if (!data) return

        form.setFieldsValue({
            deviceName: data.deviceName,
            machineKey: data.machineKey,
            instructions: Array.isArray(data.instructions)
                ? data.instructions
                : []
        })

        setImageFile(null)
        setVideoFile(null)
    }, [data])

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
        if (!modalUpdateId) return

        // Image required (new or old)
        if (!imageFile && !data?.imageNewUrl) {
            message.error('Image is required')
            return
        }

        // Video required (new or old)
        if (!videoFile && !data?.videoNewUrl) {
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
                            rules={[{ required: true }]}
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

                {/* ================= INSTRUCTIONS (REQUIRED + *) ================= */}
                <Form.Item label="Instructions" required shouldUpdate>
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
                                                            {
                                                                required: true,
                                                                message: 'Instruction is required'
                                                            }
                                                        ]}
                                                    >
                                                        <Input.TextArea rows={2} />
                                                    </Form.Item>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Form.List>

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
                        Update
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalUpdate
