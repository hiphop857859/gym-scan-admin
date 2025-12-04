import { Button as AntdButton } from 'antd'
// import ModalConfirm from 'src/components/Containers/ModalContainer/ModalConfirm'
// import { useToggle } from 'src/Hook/useToggle'

export type Props = {
  onClick: () => void
  disabled?: boolean
  isModal?: boolean
  isLoading?: boolean
  text?: string
}

const ButtonCancel = ({ onClick, disabled, isLoading, text = 'Cancel' }: Props) => {
  // const [toggle, , customToggle] = useToggle(false)

  return (
    <>
      <AntdButton
        loading={isLoading}
        className='text-lg flex items-center py-5 justify-center font-medium dark:text-white border dark:border-gray-200'
        disabled={disabled || isLoading}
        // onClick={isModal ? () => customToggle(true) : onClick}
        onClick={onClick}
      >
        {text}
      </AntdButton>
      {/* {toggle && <ModalConfirm isLoading={false} handleCancel={() => customToggle(false)} handleConfirm={onClick} />} */}
    </>
  )
}

export default ButtonCancel
