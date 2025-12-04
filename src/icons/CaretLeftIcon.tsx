import { IconSvgProps } from 'src/types'

export const CaretLeftIcon = ({ color = '#111111', ...props }: IconSvgProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' fill='none' {...props}>
      <path d='M15 19.5L7.5 12L15 4.5' stroke={color} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}
