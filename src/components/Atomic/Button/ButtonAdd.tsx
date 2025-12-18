import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import cls from 'classnames'

export type Props = {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
}

const ButtonAdd = ({ onClick, isLoading, disabled }: Props) => {
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
      icon={< PlusOutlined />}
    >
      Add
    </Button>
  )
}

export default ButtonAdd
