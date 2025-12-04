import { Button } from 'antd'
import { StopOutlined } from '@ant-design/icons' // or use your own banned icon

export type Props = {
  onClick: () => void
  isLoading?: boolean
  hidden?: boolean
  text?: string
  className?: string
}

const ButtonBanned = ({ onClick, isLoading = false, hidden = false, text = 'Banned', className }: Props) => {
  return (
    <>
      {!hidden && (
        <Button
          icon={<StopOutlined />}
          className={`text-lg h-10 text-red-600 border-red-500 hover:border-red-600 font-medium flex justify-center items-center ${className}`}
          loading={isLoading}
          onClick={onClick}
          danger
        >
          {text}
        </Button>
      )}
    </>
  )
}

export default ButtonBanned
