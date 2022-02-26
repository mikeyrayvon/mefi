interface Props {
  data: any
}

const Category: React.FC<Props> = ({ data }) => {
  const {name} = data
  return (
    <div className='border border-white rounded-lg py-2 px-3 mb-2'>
      <div className='flex justify-between items-center'>
        <div>
          <div><span>{name}</span></div>
        </div>
      </div>
    </div>
  )
};

export default Category
