import {
    Form, Modal, Upload, message, Button, Input, Row, Col, Select, Tag, Spin
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
    modalUpdateId: string | null
    handleCancel: () => void
    handleOk: () => void
}

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const generateMachineKey = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_')

const ModalUpdate = ({ modalUpdateId, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    const [detail, setDetail] = useState<any>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    /* ================= EXERCISE MEDIA ================= */
    const [mediaOptions, setMediaOptions] = useState<any[]>([])
    const [mediaLoading, setMediaLoading] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    /* ================= UPDATE API ================= */
    const { fetch, loading } = useQuery({
        func: Service.updateMachine,
        isQuery: false,
        onSuccess: () => {
            message.success('Update successfully')
            handleOk()
            handleCancel()
        }
    })

    /* ================= FORCE LOAD DETAIL ON OPEN ================= */
    useEffect(() => {
        let cancelled = false

        const load = async () => {
            if (!modalUpdateId) return

            setLoadingDetail(true)
            try {
                const res = await Service.getMachineDetail(modalUpdateId)
                if (cancelled) return

                setDetail(res)

                form.setFieldsValue({
                    deviceName: res.deviceName,
                    machineKey: res.machineKey,
                    instructions: Array.isArray(res.instructions) ? res.instructions : [],
                    exerciseMedias: Array.isArray(res.exerciseMedias)
                        ? res.exerciseMedias.map((m: any) => m.media_id)
                        : []
                })

                // preload selected options for Select label
                if (Array.isArray(res.exerciseMedias)) {
                    setMediaOptions(
                        res.exerciseMedias.map((m: any) => ({
                            id: m.media_id,
                            name: m.media_name
                        }))
                    )
                } else {
                    setMediaOptions([])
                }

                setImageFile(null)
                setVideoFile(null)
            } catch (e) {
                if (!cancelled) message.error('Load machine detail failed')
            } finally {
                if (!cancelled) setLoadingDetail(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [modalUpdateId])

    /* ================= CLEAR WHEN CLOSE ================= */
    useEffect(() => {
        if (!modalUpdateId) {
            setDetail(null)
            form.resetFields()
            setImageFile(null)
            setVideoFile(null)
            setMediaOptions([])
        }
    }, [modalUpdateId])

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        }
    }, [])

    /* ================= FETCH MEDIA SEARCH ================= */
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
        } catch {
            message.error('Failed to load exercise medias')
        } finally {
            setMediaLoading(false)
        }
    }

    const handleSearchExerciseMedia = (value: string) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => {
            fetchExerciseMedias(value)
        }, 500)
    }

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
        if (!modalUpdateId) return

        if (!imageFile && !detail?.imageNewUrl) {
            message.error('Image is required')
            return
        }
        if (!videoFile && !detail?.videoNewUrl) {
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
            width={900}
            destroyOnClose
        >
            {loadingDetail ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : (
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
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Machine Name" name="deviceName" rules={[{ required: true }]}>
                                <TextInput />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Machine Key" name="machineKey" rules={[{ required: true }]}>
                                <TextInput disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Image" required>
                                <Upload
                                    accept={IMAGE_TYPES.join(',')}
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        if (!IMAGE_TYPES.includes(file.type)) {
                                            message.error('Invalid image format')
                                            return Upload.LIST_IGNORE
                                        }
                                        setImageFile(file)
                                        return false
                                    }}
                                    onRemove={() => setImageFile(null)}
                                >
                                    <Button icon={<UploadOutlined />}>Choose Image</Button>
                                </Upload>

                                {(imageFile || detail?.imageNewUrl) && (
                                    <img
                                        src={imageFile ? URL.createObjectURL(imageFile) : detail.imageNewUrl}
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

                                {(videoFile || detail?.videoNewUrl) && (
                                    <video
                                        src={videoFile ? URL.createObjectURL(videoFile) : detail.videoNewUrl}
                                        controls
                                        className="w-full rounded-lg mt-3"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Instructions" required>
                        <Form.List name="instructions">
                            {(fields, { add, remove }) => (
                                <>
                                    <Button onClick={() => add('')}>+ Add Step</Button>
                                    {fields.map(({ key, name }, index) => (
                                        <div key={key} className="relative p-4 mt-3 border rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => remove(name)}
                                                className="absolute top-2 right-2 text-red-500"
                                            >
                                                ✕
                                            </button>
                                            <div className="mb-2 text-sm text-gray-400">Step {index + 1}</div>
                                            <Form.Item name={name} rules={[{ required: true }]}>
                                                <Input.TextArea rows={2} />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

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
                                <Select.Option key={item.id} value={item.id} label={item.name}>
                                    <div className="flex flex-col">
                                        <strong>{item.name}</strong>
                                        <span className="text-xs text-gray-400">
                                            {item.bodyPart} · {item.exerciseType}
                                        </span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update
                        </Button>
                    </div>
                </Form>
            )}
        </Modal>
    )
}

export default ModalUpdate
