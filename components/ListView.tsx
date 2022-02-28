import { useState } from 'react';
import Modal from './Modal'

interface ItemProps {
  data: any
  open: () => void
}

interface FormProps {
  data: any
  close: () => void
}

interface ListProps {
  items: any[]
  handleOpen: (a: any) => void
}

interface Props {
  Item: React.FC<ItemProps>
  Form: React.FC<FormProps>
  items: [any]
  List?: React.FC<ListProps>
  modalTitle?: string
  modalClass?: string
}

const ListView: React.FC<Props> = ({ Item, Form, items, List, modalTitle, modalClass }) => {
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)

  const handleOpen = (item = null) => {
    setModalActive(true)
    setActiveData(item)
  }

  const handleClose = () => {
    setModalActive(false)
    setActiveData(null)
  }

  return (
    <div>
      {items.length > 0 &&
        <div className='pb-28'>
          {List ? (
            <List items={items} handleOpen={handleOpen} />
          ) : (
            <ul>
              { 
                  items.map((item: any) => 
                  <li key={item.id}>
                    <Item 
                      data={item} 
                      open={() => handleOpen(item)} />
                    </li>
                ) 
              }
            </ul>
          )}
        </div>
      }
      <button 
        className='z-20 w-16 h-16 rounded-full flex justify-center items-center text-[36px] fixed bottom-8 right-8 border border-white bg-black'
        onClick={() => handleOpen(null)}>
        <span className='-mt-1'>+</span>
      </button>
      {modalActive &&
        <Modal name={activeData ? modalTitle : `New ${modalTitle}`} close={handleClose} className={modalClass}>
          <Form data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
};

export default ListView


