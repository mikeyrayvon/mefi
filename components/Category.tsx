import { useEffect, useState } from "react"
import { newDatabaseOrder, newDatabaseId } from "../utils/calc";
import { useAppContext } from "../utils/store"
import { supabase } from '../utils/supabase'

interface Props {
  data?: any,
  close: () => void
}

const Category: React.FC<Props> = ({ data, close }) => {
  const { state: { transactions, accounts, categories }, dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [ values, setValues ] = useState<{
    name: string,
    emoji: string,
    budget: number,
    type: string
  }>({
    name: '',
    emoji: '',
    budget: 0,
    type: ''
  })

  useEffect(() => {
    if (data) {
      const {name, emoji, budget, type} = data
      setValues({
        name,
        emoji,
        budget,
        type
      })
    }
  }, [data])

  const handleChange = (event: any) => {
    setValues(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  const handleSave = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    // get id if updating, or make new id if inserting
    const id = data ? data.id : newDatabaseId(categories)
    const order = data ? data.order : newDatabaseOrder(categories)

    try {
      const res = await supabase
        .from('categories')
        .upsert({
          id,
          name: values.name,
          emoji: values.emoji,
          order,
          budget: values.budget,
          type: values.type
        })
      if (res.error) {
        console.error(res.error)
        throw new Error()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      close()
    }
  }

  const handleDelete = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    try {
      const res = await supabase
        .from('categories')
        .delete()
        .eq('id', data?.id)

      if (res.error) {
        console.error(res.error)
        throw new Error()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      close()
    }
  }

  return (
    <div className='pt-4'>
      <form>
        <div className='mb-2 flex -mx-2'>
          <div className='px-2 w-3/4'>
            <div className='mb-1'><span className='text-xs text-gray-400'>Name</span></div>
            <input 
              className='w-full input text-xl' 
              name='name'
              value={values.name} 
              onChange={handleChange} 
            />
          </div>
          <div className='px-2 w-1/4'>
            <div className='mb-1'><span className='text-xs text-gray-400'>Emoji</span></div>
            <input 
              className='w-full input text-xl text-center' 
              name='emoji'
              value={values.emoji} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Type</span></div>
          <div className=''>
            <select 
              className='w-full input text-xl' 
              name='type'
              value={values.type} 
              onChange={handleChange}>
              <option value='expense'>Expense</option>
              <option value='income'>Income</option>
              <option value='transfer'>Transfer</option>
              <option value=''>Other</option>
            </select>
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Budget</span></div>
          <div className='flex -mx-2 items-center'>
            <div className='px-2 grow'>
              <input 
                className='w-full input text-xl' 
                name='budget' 
                value={values.budget} 
                type="number"
                step="1"
                min="0"
                onChange={handleChange} />
            </div>
            <div className='px-2'>
              <span className='text-xl'>CHF</span>
            </div>
          </div>
        </div>
        <div className='my-6'>
          <button className='button py-6 text-xl w-full' onClick={handleSave}>Save</button>
        </div>
        <div className=''>
          <button className='button text-xl w-full' onClick={handleDelete}>Delete</button>
        </div>
      </form>
      {loading &&
        <div className='absolute inset-0 bg-white bg-opacity-20'></div>
      }
    </div>
  )
};

export default Category
