import { Form } from 'antd'
import { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from 'src/components/Atomic/Button/Button'
import TextInput from 'src/components/Atomic/Form/TextInput'
import GridShape from 'src/components/common/GridShape'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'

export default function VerifyOTP() {
  const { showSuccess } = useToast()
  const [form] = Form.useForm<{
    email: string
    otp: string
  }>()
  const [countdown, setCountdown] = useState<number>(0)

  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const { loading, fetch: verifyOTP } = useQuery({
    func: Service.verifyOTP,
    onSuccess: () => {
      navigate('/')
      showSuccess('Verify OTP success')
    }
  })

  const { loading: loadingResend, fetch: resendOTP } = useQuery({
    func: Service.resendOTP,
    onSuccess: () => {
      showSuccess('Resend OTP success')
    }
  })

  const handleResendOTP = useCallback(() => {
    if (countdown > 0) return

    form
      .validateFields(['email'])
      .then((value) => {
        resendOTP({
          email: value.email,
          type: 'sign-up'
        })
        // Start 60 seconds cooldown after successful OTP resend
        setCountdown(60)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [form, resendOTP, countdown])

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((value) => {
        verifyOTP({
          email: value.email,
          otpCode: value.otp,
          type: 'sign-up'
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }, [form, verifyOTP])

  const initialValues = {
    email: params.email
  }

  return (
    <>
      <div className='relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0'>
        <div className='flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8'>
          <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
            <div>
              <div className='mb-5 sm:mb-8'>
                <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                  Verify OTP
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Enter the OTP sent to your email to verify!</p>
              </div>
              <div>
                <Form initialValues={initialValues} disabled={loading} form={form}>
                  <div className='space-y-6'>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          type: 'email'
                        }
                      ]}
                      className='flex-1'
                      name={'email'}
                    >
                      <TextInput required label='Email' placeholder='Enter Your Email' disabled />
                    </Form.Item>
                    <div className='flex items-center'>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            type: 'string'
                          }
                        ]}
                        required
                        className='flex-1'
                        name={'otp'}
                      >
                        <TextInput label='OTP' onPressEnter={handleSubmit} placeholder='Enter OTP' />
                      </Form.Item>
                      <Button
                        className='ml-4'
                        onClick={handleResendOTP}
                        text={countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}
                        isLoading={loadingResend}
                        disabled={countdown > 0}
                      />
                    </div>
                  </div>
                </Form>
                <div className='mt-4'>
                  <Button isLoading={loading} text='Verify' onClick={handleSubmit} />
                </div>

                <div className='mt-5'>
                  <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                    Already have an account? &nbsp;
                    <Link to='/signin' className='text-brand-500 hover:text-brand-600 dark:text-brand-400'>
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex'>
          <GridShape />
          <div className='flex flex-col items-center max-w-xs'>
            <img width={100} src='./images/logo/logo.svg' alt='Logo' />
          </div>
        </div>
      </div>
    </>
  )
}
