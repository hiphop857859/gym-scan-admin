import { Form } from 'antd'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Atomic/Button/Button'
import TextInput from 'src/components/Atomic/Form/TextInput'
import TextInputPass from 'src/components/Atomic/Form/TextInputPassword'
import GridShape from 'src/components/common/GridShape'
import { LOCAL_STORAGE_KEY } from 'src/enums'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { UserLoginPayload } from 'src/services/user'
import { useAuthStore } from 'src/store'
import { LocalStorage } from 'src/utils/localStorage.util'
import env from '../../../configs/index'
export default function SignIn() {
  const { showSuccess } = useToast()
  const [, updateAuthenticationData] = useAuthStore()
  const [form] = Form.useForm<UserLoginPayload>()

  const navigate = useNavigate()

  const { loading, fetch: loginAdmin } = useQuery({
    func: async (payload: UserLoginPayload) => {
      const loginResult = await Service.login(payload)
      LocalStorage.set(loginResult.token, LOCAL_STORAGE_KEY.AUTH_TOKEN)
      LocalStorage.set(loginResult.refreshToken, LOCAL_STORAGE_KEY.REFETCH_TOKEN)
      updateAuthenticationData((pre) => {
        return {
          ...pre,
          isAuthenticationInProgress: true
        }
      })
    },
    onSuccess: () => {
      navigate('/')
      showSuccess('login success')
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((value) => {
        loginAdmin(value)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [form, loginAdmin])

  const initialValues = {
    email: env.emailAdmin || 'admin@befest.fr',
    password: env.passwordAdmin || 'Admin@123!@#'
  }

  return (
    <>
      <div className='relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0'>
        <div className='flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8'>
          <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
            <div>
              <div className='mb-5 sm:mb-8'>
                <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                  Sign In
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Enter your email and password to sign in!</p>
              </div>
              <div>
                <Form initialValues={initialValues} disabled={loading} form={form}>
                  <div className='space-y-6'>
                    <Form.Item
                      name="email"
                      className="flex-1"
                      rules={[
                        {
                          required: true,
                          message: 'Email is required',
                        },
                        {
                          type: 'email',
                          message: 'Email is not a valid email', // <-- Custom message with uppercase
                        },
                      ]}
                    >
                      <TextInput onPressEnter={handleSubmit} required label='Email' placeholder='Enter Your Email' />
                    </Form.Item>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          type: 'string'
                        }
                      ]}
                      required
                      className='flex-1'
                      name={'password'}
                    >
                      <TextInputPass label='Password' onPressEnter={handleSubmit} placeholder='Enter Your password' />
                    </Form.Item>

                    {/* <div className='flex items-center justify-between'>
                      <Link to='/' className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'>
                        Forgot password?
                      </Link>
                    </div> */}
                  </div>
                </Form>
                <div className='mt-4'>
                  <Button isLoading={loading} text='Sign In' onClick={handleSubmit} />
                </div>

                <div className='mt-5'>
                  <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                    &nbsp;
                    <Link to='/forgot-password' className='text-brand-500 hover:text-brand-600 dark:text-brand-400'>
                      Forget my password
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
            <Link to='/' className='block mb-4'>
              <img width={100} src='./images/logo/logo.svg' alt='Logo' />
            </Link>
            <p className='text-center text-gray-400 dark:text-white/60'>Login to ADMIN</p>
          </div>
        </div>
      </div>
    </>
  )
}
