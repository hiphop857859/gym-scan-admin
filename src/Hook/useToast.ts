import { notification } from 'antd'

export const useToast = () => {
  const showSuccess = (message: string) => {
    notification.success({ message, duration: 2, showProgress: true, pauseOnHover: true })
  }

  const showError = (message: string) => {
    notification.error({
      message,
      duration: 2,
      showProgress: true,
      pauseOnHover: true
    })
  }

  return { showSuccess, showError }
}
