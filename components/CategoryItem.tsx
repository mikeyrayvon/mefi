interface Props {
  data: any
  open: () => void
}

const CategoryItem: React.FC<Props> = ({ data, open }) => {
  const {name, emoji} = data

  return (
    <button onClick={open} className='w-full border border-white rounded-lg py-2 px-3 mb-2'>
      <div className='flex items-center justify-between'>
        <div>
          <span>{name}</span>
        </div>
        <div>
          <span>{emoji}</span>
        </div>
      </div>
    </button>
  )
};

export default CategoryItem
