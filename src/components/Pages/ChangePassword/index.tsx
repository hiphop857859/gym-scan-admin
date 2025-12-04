import React, { useState } from 'react'
import { Form, Input, Button, message, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { staffService } from 'src/services/staff/request'
import { ChangePasswordPayload } from 'src/services/staff/types'
import styles from './styles.module.css'
import { getSingerErrorMessage } from 'src/helpers/ultils'

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: ChangePasswordPayload & { confirmPassword: string }) => {
    try {
      setLoading(true)
      const { newPassword, currentPassword } = values
      await staffService.changePassword({ newPassword, currentPassword })
      message.success('Password changed successfully')
      navigate('/')
    } catch (error: any) {
      message.error(getSingerErrorMessage(error) || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter new password');
    }

    const validations = [
      { regex: /.{8,}/, message: 'at least 8 characters' },
      { regex: /[A-Z]/, message: 'one uppercase letter' },
      { regex: /[a-z]/, message: 'one lowercase letter' },
      { regex: /[0-9]/, message: 'one number' },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'one special character' }
    ];

    const failed = validations
      .filter(v => !v.regex.test(value))
      .map(v => v.message);

    if (failed.length > 0) {
      return Promise.reject(`Password must contain ${failed.join(', ')}`);
    }

    return Promise.resolve();
  };

  return (
    <div className={styles.container}>
      <Card title='Change Password' className={styles.card}>
        <Form form={form} name='changePassword' onFinish={onFinish} layout='vertical' requiredMark={false}>
          <Form.Item
            name='currentPassword'
            label='Current Password'
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder='Enter current password' />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ validator: validatePassword }]}
            extra="Must contain: at least 8 chars, uppercase, lowercase, number & special character."
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            label='Confirm New Password'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The two passwords do not match'))
                }
              })
            ]}
          >
            <Input.Password placeholder='Confirm new password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ChangePassword
