import { Form } from 'antd'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Atomic/Button/Button'
import TextInput from 'src/components/Atomic/Form/TextInput'
import TextInputPass from 'src/components/Atomic/Form/TextInputPassword'
import GridShape from 'src/components/common/GridShape'
import { useQuery } from 'src/Hook/useQuery'
import { useToast } from 'src/Hook/useToast'
import { Service } from 'src/services'
import { SignUpPayload } from 'src/services/user'

export default function SignUp() {
  const { showSuccess } = useToast()
  const [form] = Form.useForm<{
    email: string
    password: string
    firstName: string
    lastName: string
    confirmPassword: string
  }>()
  const navigate = useNavigate()

  const { loading, fetch: signUp } = useQuery({
    func: Service.signUp,
    onSuccess: () => {
      console.log(form.getFieldValue('email'))

      navigate(`/verify-otp/${form.getFieldValue('email')}`)
      showSuccess('login success')
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((value) => {
        const { email, password, firstName, lastName } = value
        const payload: SignUpPayload = {
          email,
          password,
          name: `${firstName} ${lastName}`
        }
        signUp(payload)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [form, signUp])

  return (
    <>
      <div className='relative flex w-full h-screen overflow-hidden bg-white z-1 dark:bg-gray-900'>
        <div className='flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8'>
          <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
            <div className='mb-5 sm:mb-8'>
              <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                Sign Up
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Enter your email and password to sign up!</p>
            </div>
            <div>
              <Form layout='vertical' autoComplete='off' form={form} disabled={loading}>
                <div className='grid grid-cols-2 gap-2'>
                  <Form.Item name={'firstName'} className='sm:col-span-1' rules={[{ required: true }]}>
                    <TextInput label='First Name' required placeholder='Enter your first name' />
                  </Form.Item>
                  <Form.Item name={'lastName'} className='sm:col-span-1' rules={[{ required: true }]}>
                    <TextInput label='Last name' required name='lname' placeholder='Enter your last name' />
                  </Form.Item>
                </div>
                <Form.Item name={'email'} rules={[{ type: 'email' }, { required: true }]}>
                  <TextInput label='Email' required placeholder='Enter your last name' />
                </Form.Item>
                <Form.Item name={'password'} label='Password' rules={[{ required: true }]}>
                  <TextInputPass placeholder='Enter password' />
                </Form.Item>
                <Form.Item
                  name='confirmPassword'
                  label='Confirm password'
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('The two passwords do not match'))
                      }
                    })
                  ]}
                >
                  <TextInputPass placeholder='Confirm password' />
                </Form.Item>
                <div>
                  <Button onClick={handleSubmit} text='Sign up' isLoading={loading} />
                </div>
              </Form>
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
        <div className='relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex'>
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          {/* <!-- ===== Common Grid Shape End ===== --> */}
          <div className='flex flex-col items-center max-w-xs'>
            <Link to='/' className='block mb-4'>
              <img width={100} src='./images/logo/logo.svg' alt='Logo' />
            </Link>
            <p className='text-center text-gray-400 dark:text-white/60'>
              Sign up to ADMIN and get access to all the features!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
