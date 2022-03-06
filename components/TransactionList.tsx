import { useEffect, useState } from 'react'
import TransactionItem from './TransactionItem'
import { Transaction as T } from '../utils/types'
import { formatDateStr, getMonthName } from '../utils/helpers'
import Transaction from './Transaction'
import Modal from './Modal'
import { useAppContext } from '../utils/store'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import AddItemButton from './AddItemButton'

const TransactionList: React.FC = ({ }) => {
  const { state: {monthlyTransactions, transactions, categories}, dispatch } = useAppContext()
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0)

  const date = new Date()
  const todaysMonth = date.getMonth()
  const todaysYear = date.getFullYear()
  const [month, setMonth] = useState<number>(todaysMonth)
  const [year, setYear] = useState<number>(todaysYear)

  useEffect(() => {
    // get monthly transactions
    if (transactions.length > 0) {
      dispatch({ type: 'set monthly transactions', payload: {month, year} })
    }
  }, [transactions])

  useEffect(() => {
    // update the month's totals

    const income = monthlyTransactions.reduce((prev: number, txn: T) => {
      if (txn.cat) {
        const cat = categories.find(cat => cat.id === txn.cat)
        if (cat && cat.type === 'income') {
          return prev + txn.amount
        }
      }
      return prev
    }, 0)
    setMonthlyIncome(income)

    const expenses = monthlyTransactions.reduce((prev: number, txn: T) => {
      if (txn.cat) {
        const cat = categories.find(cat => cat.id === txn.cat)
        if (cat && cat.type === 'expense') {
          return prev + txn.amount
        }
      }
      return prev
    }, 0)
    setMonthlyExpenses(expenses)

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
        <div className='flex mb-2 -mx-2 pb-2 border-b border-b-gray-600'>
          <div className='px-2'>
            <button className='h-full px-4' onClick={() => updateMonth(0)}><FiArrowLeft /></button>
          </div>
          <div className='text-center p-2 grow'>
            <div className='mb-2'><h3 className=''>{getMonthName(month)}, {year}</h3></div>
            <div className='flex text-xs'>
              <div className='w-1/2'>
                <h4>Income</h4>
                <span>{monthlyIncome} CHF</span>
              </div>
              <div className='w-1/2'>
                <h4>Expenses</h4>
                <span>{monthlyExpenses} CHF</span>
              </div>
            </div>
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
                      <div className='pt-3 pb-2 px-2 flex justify-between text-xs text-gray-400'>
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
      <AddItemButton handleClick={() => handleOpen(null)} />
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
