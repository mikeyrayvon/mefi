import { useEffect, useState } from 'react';
import CategoryItem from './CategoryItem'
import { Category as C } from '../utils/types'
import { formatDateStr } from '../utils/helpers'

interface Props {
  items: C[]
  handleOpen: (a: C) => void
}

const CategoryList: React.FC<Props> = ({ items, handleOpen }) => {
  let currentDate = '' 
  return (
    <ul className='flex flex-wrap -mx-1'>
      { 
        items.map((item: C, i) => {          
          return (
            <li key={item.id} className='w-1/2 px-1'>
              <CategoryItem 
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

export default CategoryList
