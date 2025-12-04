import { useEffect } from 'react'
import { Card } from 'antd'
import Spin from 'src/components/Atomic/Spin/Spin'
import { Service } from 'src/services'
import { useNavigate } from 'react-router-dom'

export default function RefreshAccountConnected() {
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resRefreshConnectedAccountLink = await Service.refreshConnectedAccountLink()
        if (!resRefreshConnectedAccountLink.onboardingUrl) throw new Error('Onboarding url is not found')

        return (window.location.href = resRefreshConnectedAccountLink.onboardingUrl)
      } catch (error) {
        console.error('Error refreshing account connected:', error)
        return navigate('/account-connected')
      }
    }
    fetchData()
  }, [])

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Spin spinning={true}>
        <Card className='w-full max-w-md shadow-lg rounded-2xl min-w-[20vw] min-h-[20vh] ' />
      </Spin>
    </div>
  )
}
