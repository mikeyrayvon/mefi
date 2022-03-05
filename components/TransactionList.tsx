import { useEffect, useState } from 'react'
import TransactionItem from './TransactionItem'
import { Transaction as T } from '../utils/types'
import { formatDateStr, getMonthName } from '../utils/helpers'
import Transaction from './Transaction'
import Modal from './Modal'
import { useAppContext } from '../utils/store'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

const TransactionList: React.FC = ({ }) => {
  const { state: {monthlyTransactions, transactions}, dispatch } = useAppContext()
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)
  const [month, setMonth] = useState<number>(0)
  const [year, setYear] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)
  const [firstSet, setFirstSet] = useState<boolean>(false)

  useEffect(() => {
    if (!firstSet) {
      const date = new Date()
      const todaysMonth = date.getMonth()
      const todaysYear = date.getFullYear()
      setMonth(todaysMonth)
      setYear(todaysYear)
      dispatch({ type: 'set monthly transactions', payload: {month: todaysMonth, year: todaysYear} })
      setFirstSet(true)
    } else {
      dispatch({ type: 'set monthly transactions', payload: {month, year} })
    }
  }, [transactions])

  useEffect(() => {
    // update the month's total
    const total = monthlyTransactions.reduce((p: number, c: T) => {
      return p + c.amount
    }, 0)
    setMonthlyTotal(total)
  }, [monthlyTransactions])

  const handleOpen = (item: T | null) => {
    setModalActive(true)
    setActiveData(item)
  }

  const handleClose = () => {
    setModalActive(false)
    setActiveData(null)
  }

  const updateMonth = (dir: number = 0) => {
    let newMonth = month
    let newYear = year
    if (dir === 1) {
      if (month === 11) {
        newMonth = 0
        newYear++
      } else {
        newMonth++
      }
    } else {
      if (month === 0) {
        newMonth = 11
        newYear--
      } else {
        newMonth--
      }
    }
    setMonth(newMonth)
    setYear(newYear)
    dispatch({ type: 'set monthly transactions', payload: {month: newMonth, year: newYear} })
  }

  let listDate = '' 

  return (
    <div>
      <div className='pb-28'>
        <div className='flex mb-2 -mx-2'>
          <div className='px-2'>
            <button className='h-full px-4' onClick={() => updateMonth(0)}><FiArrowLeft /></button>
          </div>
          <div className='text-center p-2 grow'>
            <div><h3 className='text-sm'>{getMonthName(month)}, {year}</h3></div>
            <div><span className='text-xs'>{monthlyTotal} CHF</span></div>
          </div>
          <div className='px-2'>
            <button className='h-full px-4' onClick={() => updateMonth(1)}><FiArrowRight /></button>
          </div>
        </div>
        {monthlyTransactions.length > 0 ? (
          <ul>
            { 
              monthlyTransactions.map((item: T, i) => {     
                let dailyTotal = 0     
                const newDay = item.datetime.substring(0, 10) !== listDate.substring(0, 10) || i === 0

                if (newDay) {
                  listDate = item.datetime
                  dailyTotal = monthlyTransactions.reduce((p: number, c: T) => {
                    return c.datetime.substring(0, 10) === listDate.substring(0, 10) ? p + c.amount : p
                  }, 0)
                }

                return (
                  <li key={item.id}>
                    {newDay &&
                      <div className='pt-1 pb-2 px-2 flex justify-between text-xs text-gray-400'>
                        <span className=''>{formatDateStr(listDate)}</span>
                        <span className=''>{dailyTotal.toFixed(2)} CHF</span>
                      </div>
                    }
                    <TransactionItem 
                      data={item} 
                      open={() => handleOpen(item)} 
                    />
                  </li>
                )
              }) 
            }
          </ul> 
        ) : (
          <div className='text-center pt-24'><span className='text-gray-300 text-xs'>No transactions</span></div>
        )}
      </div>
      <button 
        className='z-20 w-16 h-16 rounded-full flex justify-center items-center text-[36px] fixed bottom-8 right-8 border border-white bg-black'
        onClick={() => handleOpen(null)}>
        <span className='-mt-1'>+</span>
      </button>
      {modalActive &&
        <Modal name={activeData ? 'Transaction' : 'New Transaction'} close={handleClose}>
          <Transaction 
            data={activeData} 
            close={handleClose} 
          />
        </Modal>
      }
    </div>
  )
}

export default TransactionList
