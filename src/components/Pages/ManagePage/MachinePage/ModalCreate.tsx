import {
    Form,
    Modal,
    Upload,
    message,
    Button,
    Input,
    Row,
    Col,
    Select,
    Tag
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

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
const generateMachineKey = (name: string) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')

const ModalCreate = ({ open, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    /* ================= EXERCISE MEDIA SEARCH ================= */
    const [mediaOptions, setMediaOptions] = useState<any[]>([])
    const [mediaLoading, setMediaLoading] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
            setMediaOptions([])
        }
    })

    useEffect(() => {
        if (open) {
            form.resetFields()
            setImageFile(null)
            setVideoFile(null)
            setMediaOptions([])
        }
    }, [open])

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    /* ================= FETCH MEDIA API ================= */
    const fetchExerciseMedias = async (search = '') => {
        setMediaLoading(true)
        try {
            const res = await Service.getExerciseMedias({
                page: 1,
                limit: 10,
                sorts: '-createdAt',
                search
            })

            setMediaOptions(res?.items || [])
        } catch (err) {
            message.error('Failed to load exercise medias')
        } finally {
            setMediaLoading(false)
        }
    }

    /* ================= DEBOUNCE SEARCH ================= */
    const handleSearchExerciseMedia = (value: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchExerciseMedias(value)
        }, 500)
    }

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
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
            } else if (key === 'exerciseMedias' && Array.isArray(value)) {
                value.forEach((id: string, index: number) => {
                    formData.append(`exerciseMedias[${index}]`, id)
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
            width={900}
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
                                            <Button onClick={() => add('')}>+ Add Step</Button>

                                            {fields.map(({ key, name }, index) => (
                                                <div
                                                    key={key}
                                                    className="relative p-4 mb-3 border rounded-lg"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(name)}
                                                        className="absolute top-3 right-3 text-red-500"
                                                    >
                                                        ✕
                                                    </button>

                                                    <div className="mb-2 font-medium">
                                                        Step {index + 1}
                                                    </div>

                                                    <Form.Item
                                                        name={name}
                                                        rules={[{ required: true }]}
                                                        className="mb-0"
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

                {/* ================= EXERCISE MEDIAS ================= */}
                <Form.Item label="Exercise Medias" name="exerciseMedias">
                    <Select
                        mode="multiple"
                        showSearch
                        allowClear
                        placeholder="Search exercise media"
                        loading={mediaLoading}
                        filterOption={false}
                        onSearch={handleSearchExerciseMedia}
                        onFocus={() => fetchExerciseMedias('')}
                        optionLabelProp="label"
                        tagRender={(props) => (
                            <Tag closable={props.closable} onClose={props.onClose}>
                                {props.label}
                            </Tag>
                        )}
                    >
                        {mediaOptions.map((item) => (
                            <Select.Option
                                key={item.id}
                                value={item.id}
                                label={item.name}
                            >
                                <div className="flex gap-3 items-center">
                                    {item.gifUrl && (
                                        <img
                                            src={item.gifUrl}
                                            className="w-10 h-10 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <strong>{item.name}</strong>
                                        <span className="text-xs text-gray-400">
                                            {item.bodyPart} · {item.exerciseType}
                                        </span>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
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
