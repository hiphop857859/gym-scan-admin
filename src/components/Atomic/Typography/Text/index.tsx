import cls from 'classnames'

// --fs-text-2xs: 0.625rem - ;
// --fs-text-xs: 0.75rem;
// --fs-text-sm: 0.875rem;
// --fs-text-md: 1rem;
// --fs-text-lg: 1.125rem;
// --fs-text-xl: 1.25rem;
// --fs-display-xs: 1.5rem;
// --fs-display-sm: 1.75rem;
// --fs-display-md: 2.25rem;
// --fs-display-lg: 2.75rem;
// --fs-display-xl: 3.75rem;
// --fs-display-2xl: 4.5rem;

type TSize = 'd-2xl' | 'd-sm' | 'd-lg' | 'd-xs' | 'd-xl' | 'lg' | 'sm' | 'md' | 'xl'

type Props = {
  type?: TSize
  children: React.ReactNode
  className?: string
}

const Text = ({ type, children, className }: Props) => {
  return (
    <p
      className={cls(` text-nature-secondary m-0 font-inter capitalize ${className}`, {
        'text-display-lg font-semibold ': type === 'd-lg',
        'text-display-xs font-semibold ': type === 'd-xs',
        'text-display-sm font-semibold ': type === 'd-sm',
        'text-lg font-semibold ': type === 'lg',
        'text-md font-medium text-whiteSecond': type === 'md',
        'text-xl font-medium': type === 'xl'
      })}
    >
      {children}
    </p>
  )
}

export default Text
