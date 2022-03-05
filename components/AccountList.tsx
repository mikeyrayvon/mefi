import { useState } from 'react'
import AccountItem from './AccountItem'
import { Account as A } from '../utils/types'
import Account from './Account'
import Modal from './Modal'
import { useAppContext } from '../utils/store'

const AccountList: React.FC = ({ }) => {
  const { state: {accounts}, dispatch } = useAppContext()
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)
  const [month, setMonth] = useState<number>(0)
  const [year, setYear] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)

  const handleOpen = (item: A | null) => {
    setModalActive(true)
    setActiveData(item)
  }

  const handleClose = () => {
    setModalActive(false)
    setActiveData(null)
  }

  return (
    <div>
      <div className='pb-28'>
        {accounts.length > 0 ? (
          <ul>
            { 
              accounts.map((item: A, i) => {     
                return (
                  <li key={item.id}>
                    <AccountItem 
                      data={item} 
                      open={() => handleOpen(item)} 
                    />
                  </li>
                )
              }) 
            }
          </ul> 
        ) : (
          <div className='text-center pt-24'><span className='text-gray-300 text-xs'>No accounts</span></div>
        )}
      </div>
      <button 
        className='z-20 w-16 h-16 rounded-full flex justify-center items-center text-[36px] fixed bottom-8 right-8 border border-white bg-black'
        onClick={() => handleOpen(null)}>
        <span className='-mt-1'>+</span>
      </button>
      {modalActive &&
        <Modal name={activeData ? 'Account' : 'New Account'} close={handleClose}>
          <Account data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
}

export default AccountList
