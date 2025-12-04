import { Form } from 'antd'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Atomic/Button/Button'
import TextInput from 'src/components/Atomic/Form/TextInput'
import GridShape from 'src/components/common/GridShape'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'

export default function ForgetPassword() {
    const { showSuccess, showError } = useToast()
    const [form] = Form.useForm<{ email: string }>()
    const navigate = useNavigate()

    // Hook gọi API quên mật khẩu
    const { loading, fetch: forgotPassword } = useQuery({
        func: Service.forgotPassword, // cần khai báo trong service
        onSuccess: () => {
            showSuccess('Reset link sent successfully! Please check your email.')
            navigate('/signin')
        },
        onError: (err) => {
            showError(err?.message || 'Failed to send reset link')
        }
    })

    const handleSubmit = useCallback(() => {
        form
            .validateFields()
            .then((value) => {
                forgotPassword({ email: value.email })
            })
            .catch((error) => console.log(error))
    }, [form, forgotPassword])

    return (
        <div className='relative flex w-full h-screen overflow-hidden bg-white z-1 dark:bg-gray-900'>
            <div className='flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8'>
                <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                    <div className='mb-5 sm:mb-8'>
                        <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                            Forgot Password
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Enter your email and we’ll send you a link to reset your password.
                        </p>
                    </div>

                    <Form layout='vertical' autoComplete='off' form={form} disabled={loading}>
                        <Form.Item
                            name='email'
                            label='Email'
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Invalid email format' }
                            ]}
                        >
                            <TextInput placeholder='you@example.com' />
                        </Form.Item>

                        <div>
                            <Button onClick={handleSubmit} text='Send Reset Link' isLoading={loading} />
                        </div>
                    </Form>

                    <div className='mt-5'>
                        <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                            Remember your password? &nbsp;
                            <Link to='/signin' className='text-brand-500 hover:text-brand-600 dark:text-brand-400'>
                                Back to Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className='relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex'>
                <GridShape />
                <div className='flex flex-col items-center max-w-xs'>
                    <Link to='/' className='block mb-4'>
                        <img width={100} src='./images/logo/logo.svg' alt='Logo' />
                    </Link>
                    <p className='text-center text-gray-400 dark:text-white/60'>
                        Reset your password and get back to your account.
                    </p>
                </div>
            </div>
        </div>
    )
}
