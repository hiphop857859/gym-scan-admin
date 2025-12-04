import { Button } from 'antd'
import { Trash4Icon } from 'src/icons/Trash4Icon'

export type Props = {
  onClick: () => void
  isLoading?: boolean
  hidden?: boolean
  text?: string
  className?: string
}
const ButtonDelete = ({ onClick, isLoading = false, hidden = false, text = 'Delete', className }: Props) => {
  return (
    <>
      {!hidden && (
        <Button
          icon={<Trash4Icon color='currentColor' />}
          className={`text-lg h-10 text-red-600 border-red-500 hover:border-error-main  font-medium flex justify-center items-center ${className}`}
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

export default ButtonDelete
