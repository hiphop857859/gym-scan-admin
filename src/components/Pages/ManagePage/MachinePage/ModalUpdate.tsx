import { Form, Modal, Switch, Upload, message, Button as AntButton, Input } from 'antd'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

import TextInput from 'src/components/Atomic/Form/TextInput'
import { useQuery } from 'src/Hook/useQuery'
import { Service } from 'src/services'

interface Props {
    modalUpdateId: string | null
    handleCancel: () => void
    handleOk: () => void
}

const ModalUpdate = ({ modalUpdateId, handleCancel, handleOk }: Props) => {
    const [form] = Form.useForm()

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    /* ================= GET DETAIL ================= */
    const { data } = useQuery({
        func: Service.getMachineDetail,
        params: modalUpdateId,
        isQuery: !!modalUpdateId
    })

    /* ================= UPDATE ================= */
    const { fetch, loading } = useQuery({
        func: Service.updateMachine,
        isQuery: false,
        onSuccess: () => {
            message.success('Update successfully')
            handleOk()
            handleCancel()
        }
    })

    /* ================= SET FORM ================= */
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

    /* ================= SUBMIT ================= */
    const handleSubmit = (values: any) => {
        if (!modalUpdateId) return

        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value ?? '')
        })

        if (imageFile) formData.append('image', imageFile)
        if (videoFile) formData.append('video', videoFile)

        fetch({
            id: modalUpdateId,
            payload: formData
        })
    }

    return (
        <Modal
            open={!!modalUpdateId}
            onCancel={handleCancel}
            title="Update Machine"
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
                            message: 'Machine Key must be lowercase and underscore only (e.g. machine_key)'
                        }
                    ]}
                >
                    <TextInput placeholder="e.g. machine_key" />
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

                    {!imageFile && data?.imageNewUrl && (
                        <img
                            src={data.imageNewUrl}
                            className="w-40 h-40 object-cover rounded-lg mt-3"
                        />
                    )}
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

                    {!videoFile && data?.videoNewUrl && (
                        <video
                            src={data.videoNewUrl}
                            controls
                            className="w-full rounded-lg mt-3"
                        />
                    )}
                </Form.Item>

                <Form.Item
                    label="Gym Machine"
                    name="isGymMachine"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                {/* ✅ Instruction = TEXT */}
                <Form.Item
                    label="Instruction"
                    name="instruction"
                >
                    <Input.TextArea
                        placeholder="Enter instruction"
                        rows={4}
                        showCount
                        maxLength={500}
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
                        Update
                    </AntButton>
                </div>
            </Form>
        </Modal>
    )
}

export default ModalUpdate
