import { CheckSquareOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import cls from 'classnames'

export type Props = {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
}

const ButtonConfirm = ({ onClick, isLoading, disabled }: Props) => {
  return (
    <Button
      loading={isLoading}
      onClick={onClick}
      disabled={disabled}
      className={cls(
        'bg-primary-500 font-medium text-base py-5 text-info-main flex items-center',
        disabled && 'dark:text-gray-400 !border-gray-400',
        !disabled && 'dark:text-brand-500 border-brand-500'
      )}
      icon={<CheckSquareOutlined />}
    >
      Confirm
    </Button>
  )
}

export default ButtonConfirm
