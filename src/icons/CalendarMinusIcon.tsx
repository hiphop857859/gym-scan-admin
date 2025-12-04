import { IconSvgProps } from 'src/types'

export const CalendarMinusIcon = ({ color = '#111111', ...props }: IconSvgProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={24} height={25} viewBox='0 0 24 25' fill='none' {...props}>
    <path
      d='M4.625 8.96875H20.375M6.66071 2.5V4.18771M18.125 2.5V4.1875M18.125 4.1875H6.875C5.01104 4.1875 3.5 5.69854 3.5 7.5625V18.8126C3.5 20.6766 5.01104 22.1876 6.875 22.1876H18.125C19.989 22.1876 21.5 20.6766 21.5 18.8126L21.5 7.5625C21.5 5.69854 19.989 4.1875 18.125 4.1875ZM15.3125 15.1563H9.6875'
      stroke={color}
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
