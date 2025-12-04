import Button from './Button'

export type Props = {
  isLoading?: boolean
  onClick: (...args: any[]) => void
  className?: string
  text?: string
}

const ButtonSearch = ({ text = 'search', onClick }: Props) => {
  return <Button text={text} onClick={onClick} />
}

export default ButtonSearch
