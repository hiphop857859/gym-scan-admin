import { Form } from 'antd'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from 'src/components/Atomic/Button/Button'
import TextInputPass from 'src/components/Atomic/Form/TextInputPassword'
import GridShape from 'src/components/common/GridShape'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { ResetPasswordPayload } from 'src/services/user'

export default function ResetPassword() {
    const { showSuccess, showError } = useToast()
    const [form] = Form.useForm<{ password: string; confirmPassword: string }>()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    // ✅ state theo dõi mật khẩu nhập
    const [passwordValue, setPasswordValue] = useState('')

    // ✅ hàm kiểm tra từng rule
    const passwordRules = (password: string) => ({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[\W_]/.test(password)
    })

    const rules = passwordRules(passwordValue)

    const { loading, fetch: resetPassword } = useQuery({
        func: (payload: ResetPasswordPayload) => Service.resetPasswordAdmin(payload),
        onSuccess: () => {
            showSuccess('Password reset successfully!')
            navigate('/signin')
        },
        onError: (err) => {
            showError(err?.message || 'Failed to reset password')
        }
    })

    const handleSubmit = useCallback(() => {
        form
            .validateFields()
            .then((values) => {
                if (!token) {
                    showError('Invalid or missing token.')
                    return
                }

                const payload: ResetPasswordPayload = {
                    token,
                    password: values.password
                }

                resetPassword(payload)
            })
            .catch(() => { })
    }, [form, token, resetPassword, showError])

    return (
        <div className='relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white dark:bg-gray-900 sm:p-0'>
            <div className='flex flex-col flex-1 p-6 sm:p-8'>
                <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                    <div>
                        <div className='mb-6'>
                            <h1 className='mb-2 font-semibold text-gray-800 dark:text-white text-xl'>Create New Password</h1>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Enter your new password to reset your account.
                            </p>
                        </div>

                        <Form layout='vertical' autoComplete='off' form={form} disabled={loading}>
                            <Form.Item
                                name='password'
                                label='New Password'
                                rules={[
                                    { required: true, message: 'Please enter your new password' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || Object.values(passwordRules(value)).every(Boolean)) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                new Error('Password does not meet the requirements.')
                                            )
                                        }
                                    })
                                ]}
                            >
                                <TextInputPass
                                    placeholder='Enter new password'
                                    onChange={(e) => setPasswordValue(e.target.value)}
                                    onPressEnter={handleSubmit}
                                />
                            </Form.Item>

                            {/* ✅ Checklist rule UI */}
                            <div className='mt-1 mb-4 text-sm space-y-1'>
                                <div className={`flex items-center gap-2 ${rules.length ? 'text-green-600' : 'text-gray-500'}`}>
                                    {rules.length ? '✅' : '❌'} At least 8 characters
                                </div>
                                <div className={`flex items-center gap-2 ${rules.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    {rules.uppercase ? '✅' : '❌'} At least one uppercase letter
                                </div>
                                <div className={`flex items-center gap-2 ${rules.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    {rules.lowercase ? '✅' : '❌'} At least one lowercase letter
                                </div>
                                <div className={`flex items-center gap-2 ${rules.number ? 'text-green-600' : 'text-gray-500'}`}>
                                    {rules.number ? '✅' : '❌'} At least one number
                                </div>
                                <div className={`flex items-center gap-2 ${rules.special ? 'text-green-600' : 'text-gray-500'}`}>
                                    {rules.special ? '✅' : '❌'} At least one special character
                                </div>
                            </div>

                            <Form.Item
                                name='confirmPassword'
                                label='Confirm Password'
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(new Error('Passwords do not match'))
                                        }
                                    })
                                ]}
                            >
                                <TextInputPass placeholder='Confirm new password' onPressEnter={handleSubmit} />
                            </Form.Item>
                        </Form>

                        <div className='mt-4'>
                            <Button isLoading={loading} text='Reset Password' onClick={handleSubmit} />
                        </div>

                        <div className='mt-5 text-center text-sm text-gray-700 dark:text-gray-400'>
                            Remembered your password?{' '}
                            <Link to='/signin' className='text-brand-500 hover:text-brand-600'>
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className='hidden lg:flex flex-1 items-center justify-center bg-brand-950 dark:bg-white/5 p-8'>
                <GridShape />
            </div>
        </div>
    )
}
