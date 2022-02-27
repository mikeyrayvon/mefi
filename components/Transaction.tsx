import { useEffect, useState } from "react"
import { newDatabaseId } from "../utils/calc";
import { useAppContext } from "../utils/store"
import { supabase } from '../utils/supabase'

interface Props {
  data?: any,
  close: () => void
}

const Transaction: React.FC<Props> = ({ data, close }) => {
  const { state: { transactions, accounts, categories }, dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const today = new Date()
  const [ values, setValues ] = useState<{
    amount: number,
    currency: any,
    cat: any,
    date: any,
    from: any,
    to: any,
    note: any
  }>({
    amount: 0,
    currency: 'chf',
    cat: '',
    date: today.toISOString().substring(0, 10),
    from: '',
    to: '',
    note: ''
  })

  useEffect(() => {
    if (data) {
      const {amount, currency, cat, datetime, from , to, note} = data

      setValues({
        amount: amount ?? 0,
        currency: currency ?? 'chf',
        cat: cat ?? '',
        date: datetime ? datetime.substring(0, 10) : today.toISOString().substring(0, 10),
        from: from ?? '',
        to: to ?? '',
        note: note ?? ''
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
    const id = data ? data.id : newDatabaseId(transactions)
    const date = new Date(values.date) 

    try {
      const res = await supabase
        .from('transactions')
        .upsert({
          id,
          amount: values.amount,
          currency: values.currency,
          cat: values.cat == '' ? null : values.cat,
          datetime: date.toISOString(),
          from: values.from == '' ? null : values.from,
          to: values.to == '' ? null : values.to,
          note: values.note
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

    if (window.confirm("Do you really want to delete this?")) {
      setLoading(true)

      try {
        const res = await supabase
          .from('transactions')
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
  }

  return (
    <div className='pt-4'>
      <form>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Amount</span></div>
          <div className='flex -mx-2'>
            <div className='px-2 w-2/3'>
              <input 
                className='w-full input text-xl' 
                name='amount' 
                value={values.amount} 
                inputMode="decimal"
                type='number'
                step="0.01"
                min="0"
                onChange={handleChange} />
            </div>
            <div className='px-2 w-1/3'>
              <select 
                className='w-full input text-xl' 
                name='currency'
                value={values.currency} 
                onChange={handleChange}>
                <option value='chf'>CHF</option>
                <option value='usd'>USD</option>
                <option value='eur'>EUR</option>
              </select>
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Category</span></div>
          <div className=''>
            <select 
              className='w-full input text-xl' 
              name='cat'
              value={values.cat} 
              onChange={handleChange}>
              <option value=''></option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Date</span></div>
          <div className=''>
            <input 
              className='w-full input text-xl' 
              name='date'
              type='date'
              value={values.date} 
              onChange={handleChange} />
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>From</span></div>
          <div className=''>
            <select 
              className='w-full input text-xl' 
              name='from'
              value={values.from} 
              onChange={handleChange}>
              <option value=''></option>
              {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>To</span></div>
          <div className=''>
            <select 
              className='w-full input text-xl' 
              name='to'
              value={values.to} 
              onChange={handleChange}>
              <option value=''></option>
              {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Note</span></div>
          <textarea 
            className='w-full input text-xl' 
            name='note'
            value={values.note} 
            onChange={handleChange}
            style={{ resize: 'none' }} />
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

export default Transaction
