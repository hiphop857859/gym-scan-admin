import { Button, Card, Tag } from 'antd'
import { Service } from 'src/services'
import { useState, useEffect, useCallback } from 'react'
import { CompletenessStatus } from 'src/services/connectedAccount'
import Spin from 'src/components/Atomic/Spin/Spin'
import { useToast } from 'src/Hook/useToast'

export default function AccountConnected() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(CompletenessStatus.NOT_CONNECTED)
  const [getKYCLoading, setGetKYCLoading] = useState(false)

  const { showError } = useToast()

  const checkConnectedAccount = useCallback(async () => {
    try {
      setLoading(true)
      const res = await Service.checkConnectedAccount()
      if (!res.id) {
        setStatus(CompletenessStatus.NOT_CONNECTED)

        return
      }

      setStatus(res.accountCompleteness)
    } catch {
      showError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  const createConnectedAccount = async () => {
    try {
      setStatus(CompletenessStatus.COMPLETING)
      const res = await Service.createConnectedAccount({
        businessType: 'individual',
        country: 'US'
      })
      if (!res.id) {
        return setStatus(CompletenessStatus.NOT_CONNECTED)
      }

      return checkConnectedAccount()
    } catch (error: any) {
      if (error?.errorFields) return
      setStatus(CompletenessStatus.NOT_CONNECTED)
      showError('Something went wrong')
    }
  }

  useEffect(() => {
    checkConnectedAccount()
  }, [])

  const KYCHandler = async () => {
    try {
      setGetKYCLoading(true)
      if (status === CompletenessStatus.NOT_CONNECTED) await createConnectedAccount()

      const res = await Service.getConnectedAccountLink()
      if (!res.onboardingUrl) throw new Error('Onboarding url is not found')

      return (window.location.href = res.onboardingUrl)
    } catch (error) {
      setGetKYCLoading(false)
      showError('Something went wrong')
    }
  }

  const renderStatusTag = () => {
    switch (status) {
      case CompletenessStatus.COMPLETED:
        return <Tag color='green'>Connected</Tag>
      case CompletenessStatus.COMPLETING:
        return <Tag color='orange'>Connecting...</Tag>
      case CompletenessStatus.INCOMPLETE:
        return <Tag color='orange'>Incomplete</Tag>
      case CompletenessStatus.PARTIALLY_COMPLETE:
        return <Tag color='orange'>Partially Complete</Tag>
      default:
        return <Tag color='red'>Not connected</Tag>
    }
  }

  const renderDataBindStatus = () => {
    switch (status) {
      case CompletenessStatus.COMPLETED:
        return
      default:
        return (
          <>
            <Button type='primary' loading={getKYCLoading} onClick={KYCHandler} className='w-full'>
              {getKYCLoading ? 'KYC Progress...' : 'KYC now'}
            </Button>
          </>
        )
    }
  }

  if (loading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center p-4'>
        <Spin spinning={true}>
          <Card className='w-full max-w-md shadow-lg rounded-2xl min-w-[20vw] min-h-[20vh] ' />
        </Spin>
      </div>
    )
  }

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-lg rounded-2xl'>
        {
          <div className='flex flex-col gap-4'>
            <h2>Status: {renderStatusTag()}</h2>
            {renderDataBindStatus()}
          </div>
        }
      </Card>
    </div>
  )
}
