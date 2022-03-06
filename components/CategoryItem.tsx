interface Props {
  data: any
  open: () => void
}

const CategoryItem: React.FC<Props> = ({ data, open }) => {
  const {name, emoji} = data

  return (
    <button onClick={open} className='w-full button py-2 px-3 mb-2'>
      <div className='text-center'>
        <div>
          <span className='text-3xl'>{emoji}</span>
        </div>
        <div>
          <span className='text-xs'>{name}</span>
        </div>
      </div>
    </button>
  )
};

export default CategoryItem
