import { useState } from 'react';
import Modal from './Modal'

interface ItemProps {
  data: any,
  open: () => void
}

interface FormProps {
  data: any,
  close: () => void
}

interface Props {
  Item: React.FC<ItemProps>,
  Form: React.FC<FormProps>,
  items: [any],
  modalTitle?: string,
  modalClass?: string
}

const ListView: React.FC<Props> = ({ Item, Form, items, modalTitle, modalClass }) => {
  const [modalActive, setModalActive] = useState<boolean>(false)
  const [activeData, setActiveData] = useState<any>(null)

  const handleOpen = (txn = null) => {
    setModalActive(true)
    setActiveData(txn)
  }

  const handleClose = () => {
    setModalActive(false)
    setActiveData(null)
  }

  return (
    <div>
      {items.length > 0 &&
        <ul>
          { 
              items.map((txn: any) => 
              <li key={txn.id}>
                <Item 
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
      {modalActive &&
        <Modal name={activeData ? modalTitle : `New ${modalTitle}`} close={handleClose} className={modalClass}>
          <Form data={activeData} close={handleClose} />
        </Modal>
      }
    </div>
  )
};

export default ListView


