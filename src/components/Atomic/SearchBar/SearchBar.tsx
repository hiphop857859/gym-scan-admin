type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const SearchBar = ({ onChange }: Props) => {
  return (
    <div className='flex flex-1 bg-primary-200 gap-4 px-6 py-4 rounded-full items-center'>
      <input
        placeholder='Search partner by name or phone'
        onChange={onChange}
        className='border-none outline-none bg-primary-200 text-xl w-full text-nature-secondary'
        name='searchItem'
      />
    </div>
  )
}

export default SearchBar
