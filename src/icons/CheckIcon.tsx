import { IconSvgProps } from 'src/types'

export const CheckIcon = ({ color = '#fff', strokeWidth = '3', ...props }: IconSvgProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    viewBox='0 0 24 24'
    stroke={color}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
  </svg>
)
