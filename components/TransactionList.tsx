import { useEffect, useState } from 'react';
import TransactionItem from './TransactionItem'
import { Transaction as T } from '../utils/types'
import { formatDateStr } from '../utils/helpers'

interface Props {
  items: T[]
  handleOpen: (a: T) => void
}

const TransactionList: React.FC<Props> = ({ items, handleOpen }) => {
  let currentDate = '' 
  return (
    <ul>
      { 
        items.map((item: T, i) => {          
          const newDay = item.datetime.substring(0, 10) !== currentDate.substring(0, 10) || i === 0

          if (newDay)
            currentDate = item.datetime

          return (
            <li key={item.id}>
              {newDay &&
                <div className='pt-1 pb-2 pl-2'>
                  <span className='text-xs text-gray-400'>{formatDateStr(currentDate)}</span>
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
  )
}

export default TransactionList
