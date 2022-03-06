import { useState } from 'react'
import CategoryItem from './CategoryItem'
import { Category as C } from '../utils/types'
import Category from './Category'
import Modal from './Modal'
import { useAppContext } from '../utils/store'
import AddItemButton from './AddItemButton'

const CategoryList: React.FC = ({ }) => {
  const { state: {categories}, dispatch } = useAppContext()
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)
  const [month, setMonth] = useState<number>(0)
  const [year, setYear] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)

  const handleOpen = (item: C | null) => {
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
        {categories.length > 0 ? (
          <ul className='flex flex-wrap -mx-2 pt-8'>
            { 
                categories.map((item: C, i) => {     
                return (
                  <li key={item.id} className='px-2 w-1/2 mb-1'>
                    <CategoryItem 
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
        <Modal name={activeData ? 'Category' : 'New Category'} close={handleClose}>
          <Category data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
}

export default CategoryList
