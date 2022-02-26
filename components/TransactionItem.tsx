import { useAppContext } from "../utils/store";

interface Props {
  data: any,
  open: () => void
}

const Transaction: React.FC<Props> = ({ data, open }) => {
  const { state: { accounts, categories }, dispatch } = useAppContext()
  const {amount, currency, cat, note, from, to} = data
  
  const getCategoryName = () => {
    const category = categories.find((c: any) => c.id == cat)
    return category.name ?? ''
  }

  return (
    <button onClick={open} className='w-full text-left border border-white rounded-lg py-2 px-3 mb-2'>
      <div className='flex justify-between items-center'>
        <div>
          <div>
            {cat ? (
              <span>{getCategoryName()}</span>
            ) : (
              <span>Miscellaneous</span>
            )}
          </div>
          <div><span className='text-xs'>{note}</span></div>
        </div>
        <div>
          <span className='text-2xl'>{amount.toFixed(2)}</span> <span>{currency.toUpperCase()}</span>
        </div>
      </div>
    </button>
  )
};

export default Transaction
