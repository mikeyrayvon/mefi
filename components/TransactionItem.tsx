import { useAppContext } from '../utils/store'
import { Category as C } from '../utils/types'

interface Props {
  data: any
  open: () => void
}

const Transaction: React.FC<Props> = ({ data, open }) => {
  const { state: { accounts, categories }, dispatch } = useAppContext()
  const { amount, currency, cat, note, from, to } = data
  
  const txnCat = categories.find((c: C) => c.id == cat)

  return (
    <button onClick={open} className='w-full text-left border border-white rounded-lg py-2 px-3 mb-2'>
      <div className='flex justify-between items-center'>
        <div>
          <div>
            {txnCat &&
              <span>
                <span className='mr-2'>{txnCat.name}</span><span>{txnCat.emoji}</span>
              </span>
            }
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
