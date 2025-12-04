import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const ButtonIcon = ({ children, className, onClick }: Props) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex justify-center items-center w-10 h-10 rounded-full bg-secondary hover:bg-main transition-all duration-300 ease-in-out cursor-pointer ${className}`}
    >
      {children}
    </span>
  )
}

export default ButtonIcon
