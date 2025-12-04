// src/components/Atomic/Button/ButtonUnBanned.tsx
import { Button } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

export type Props = {
  onClick: () => void
  isLoading?: boolean
  hidden?: boolean
  text?: string
  className?: string
}

const ButtonUnBanned = ({ onClick, isLoading = false, hidden = false, text = 'Unban', className }: Props) => {
  return (
    <>
      {!hidden && (
        <Button
          icon={<CheckOutlined />}
          className={`text-lg h-10 text-green-600 border-green-500 hover:border-green-600 font-medium flex justify-center items-center ${className}`}
          loading={isLoading}
          onClick={onClick}
        // type='primary'
        >
          {text}
        </Button>
      )}
    </>
  )
}

export default ButtonUnBanned
