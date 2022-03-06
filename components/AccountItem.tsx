import { useEffect, useState } from "react";
import { accountBalanceFromTransactions } from "../utils/calc";
import { useAppContext } from "../utils/store";

interface Props {
  data: any
  open: () => void
}

const Account: React.FC<Props> = ({ data, open }) => {
  const { state: {transactions} } = useAppContext()
  const {name, currency} = data
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    if (transactions && data) {
      const calcBalance = accountBalanceFromTransactions(data.id, transactions)
      setBalance(calcBalance)
    }
  }, [transactions, data])

  return (
    <button onClick={open} className='w-full button py-6 px-3 mb-4'>
      <div className='flex justify-between items-center'>
        <div>
          <div><span>{name}</span></div>
        </div>
        <div>
          <span className='text-2xl'>{balance.toFixed(2)}</span> <span>{currency.toUpperCase()}</span>
        </div>
      </div>
    </button>
  )
};

export default Account
