import { useState } from 'react'
import AccountItem from './AccountItem'
import { Account as A } from '../utils/types'
import Account from './Account'
import Modal from './Modal'
import { useAppContext } from '../utils/store'
import AddItemButton from './AddItemButton'

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
          <ul className='pt-8'>
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
      <AddItemButton handleClick={() => handleOpen(null)} />
      {modalActive &&
        <Modal name={activeData ? 'Account' : 'New Account'} close={handleClose}>
          <Account data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
}

export default AccountList
