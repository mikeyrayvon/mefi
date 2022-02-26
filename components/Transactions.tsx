import { useState } from 'react';
import { useAppContext } from '../utils/store'
import TransactionItem from './TransactionItem'
import Transaction from './Transaction'
import Modal from './Modal'

const Transactions: React.FC = () => {
  const [transactionActive, setTransactionActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)
  const { state: {transactions} } = useAppContext()

  const handleOpen = (txn = null) => {
    setTransactionActive(true)
    setActiveData(txn)
  }

  const handleClose = () => {
    setTransactionActive(false)
    setActiveData(null)
  }

  return (
    <div>
      {transactions.length > 0 &&
        <ul>
          { 
            transactions.map((txn: any) => 
              <li key={txn.id}>
                <TransactionItem 
                  data={txn} 
                  open={() => handleOpen(txn)} />
                </li>
            ) 
          }
        </ul>
      }
      <button 
        className='z-20 w-16 h-16 rounded-full flex justify-center items-center text-[36px] fixed bottom-8 right-8 border border-white bg-black'
        onClick={() => handleOpen(null)}>
        <span className='-mt-1'>+</span>
      </button>
      {transactionActive &&
        <Modal name={activeData ? 'Transaction' : 'New Transaction'} close={handleClose}>
          <Transaction data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
};

export default Transactions


