interface Props {
  handleClick: () => void
}

const AddItemButton: React.FC<Props> = ({ handleClick }) => {
  return (
    <button 
      className='z-20 w-16 h-16 rounded-full flex justify-center items-center text-[36px] fixed bottom-8 right-8 bg-gray-400'
      onClick={handleClick}>
      <span className='-mt-1'>+</span>
    </button>
  )
}

export default AddItemButton