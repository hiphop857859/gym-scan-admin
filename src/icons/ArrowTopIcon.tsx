import { IconSvgProps } from 'src/types'

export const ArrowTopIcon = ({ color = '#111111', ...props }: IconSvgProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={13} height={6} viewBox='0 0 13 6' fill='none' {...props}>
    <path
      d='M5.35872 0.696238C5.7484 0.310561 6.37596 0.310561 6.76563 0.696238L12.1244 6L0 6L5.35872 0.696238Z'
      fill={color}
    />
  </svg>
)
