import clsx from 'clsx'

export const DashedDivider = ({ className }: { className?: string }) => {
  return <div className={clsx('border-t-1 border-dashed border-gray-300', className)}></div>
}
