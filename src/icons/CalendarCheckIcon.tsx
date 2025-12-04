import { IconSvgProps } from 'src/types'

export const CalendarCheckIcon = ({ color = '#111111', ...props }: IconSvgProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} viewBox='0 0 20 20' fill='none' {...props}>
    <path
      d='M3.85425 7.05762H16.9792M5.55068 1.66699V3.07341M15.1042 1.66699V3.07324M15.1042 3.07324H5.72925C4.17595 3.07324 2.91675 4.33244 2.91675 5.88574V15.2608C2.91675 16.8141 4.17595 18.0733 5.72925 18.0733H15.1042C16.6575 18.0733 17.9167 16.8141 17.9167 15.2608L17.9167 5.88574C17.9167 4.33244 16.6575 3.07324 15.1042 3.07324ZM8.073 12.6827L9.47925 14.0889L12.7605 10.8077'
      stroke={color}
      strokeWidth='1.25'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
