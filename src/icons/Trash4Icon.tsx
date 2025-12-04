import { IconSvgProps } from 'src/types'

export const Trash4Icon = ({ color = '#ef4444', ...props }: IconSvgProps) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={19} height={19} viewBox='0 0 19 19' fill='none' {...props}>
    <path
      d='M2.30078 4.5501H16.7008M6.80078 1.8501H12.2008M7.70078 13.5501V8.1501M11.3008 13.5501V8.1501M12.6508 17.1501H6.35078C5.35667 17.1501 4.55078 16.3442 4.55078 15.3501L4.13984 5.48757C4.11854 4.97625 4.52731 4.5501 5.03906 4.5501H13.9625C14.4743 4.5501 14.883 4.97625 14.8617 5.48757L14.4508 15.3501C14.4508 16.3442 13.6449 17.1501 12.6508 17.1501Z'
      stroke={color}
      strokeWidth='1.25'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
