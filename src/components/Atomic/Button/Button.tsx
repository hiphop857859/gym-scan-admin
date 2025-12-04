import { Button as AntdButton } from 'antd'
import clsx from 'clsx'
import { IconComponent } from 'src/types'

export type Props = {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  text: string
  Icon?: IconComponent
  className?: string
}

const Button = ({ onClick, disabled, isLoading, Icon, text, className }: Props) => {
  const IconButton = Icon ? <Icon color='white' width={16} height={16} /> : undefined

  return (
    <>
      <AntdButton
        color='primary'
        variant='outlined'
        loading={isLoading}
        className={clsx('flex items-center py-5 justify-center dark:text-white', className)}
        disabled={disabled || isLoading}
        icon={IconButton}
        onClick={onClick}
      >
        {text}
      </AntdButton>
    </>
  )
}

export default Button
