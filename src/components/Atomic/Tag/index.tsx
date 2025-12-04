import classNames from 'classnames'
import React from 'react'
import { CloseIcon } from 'src/icons/CloseIcon'

type Props = {
  onClick: VoidFunction
  children: React.ReactNode
  color?: 'primary' | 'secondary' | 'third'
}

const Tag = ({ children, color = 'primary', onClick }: Props) => {
  return (
    <span
      className={classNames(
        'inline-flex cursor-pointer mx-2 bg-transparent items-center justify-center gap-2 rounded  p-1  font-semibold border ',
        color === 'primary' && 'text-blue-500 border-blue-500 ',
        color === 'secondary' && 'text-yellow-500 border-yellow-300',
        color === 'third' && 'text-green-500-500 border-green-300'
      )}
    >
      {children}
      <CloseIcon className=' relative hover:scale-105 ' onClick={onClick} color='#fff' />
    </span>
  )
}

export default Tag
