import { useEffect, useState } from "react";
import { useAppContext } from "../utils/store";

interface Props {
  data: any
}

const Account: React.FC<Props> = ({ data }) => {
  const { state: {transactions} } = useAppContext()
  const {name, currency} = data
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    let calcBalance = balance
    transactions.forEach((t: any) => {
      if (t.from === data.id) {
        calcBalance = calcBalance - t.amount
      } else if (t.to === data.id) {
        calcBalance = calcBalance + t.amount
      }
    })
    setBalance(calcBalance)
  }, [transactions])

  return (
    <div className='border border-white rounded-lg py-2 px-3 mb-2'>
      <div className='flex justify-between items-center'>
        <div>
          <div><span>{name}</span></div>
        </div>
        <div>
          <span className='text-2xl'>{balance.toFixed(2)}</span> <span>{currency.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
};

export default Account
