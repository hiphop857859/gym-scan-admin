import { IconSvgProps } from 'src/types'

export const CloseIcon = ({ color = '#111111', ...props }: IconSvgProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} viewBox='0 0 18 18' fill='none' {...props}>
    <path d='M12.75 5.25L5.25 12.75M12.75 12.75L5.25 5.25' stroke={color} strokeWidth='1.5' strokeLinecap='round' />
  </svg>
)
