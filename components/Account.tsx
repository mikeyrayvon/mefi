import { useEffect, useState } from "react"
import { useAppContext } from "../utils/store"
import { supabase } from '../utils/supabase'
import { accountBalanceFromTransactions, newDatabaseId } from '../utils/calc'
import { Auth } from '@supabase/ui'

interface Props {
  data?: any,
  close: () => void
}

const Account: React.FC<Props> = ({ data, close }) => {
  const { user } = Auth.useUser()
  const { state: { transactions, accounts, categories }, dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [initialBalance, setInitialBalance] = useState(0)
  const [ values, setValues ] = useState<{
    name: any,
    currency: any,
    balance: number
  }>({
    name: '',
    currency: 'chf',
    balance: 0
  })  

  useEffect(() => {
    let txnBalance = 0
    if (data && transactions) {
      txnBalance = accountBalanceFromTransactions(data.id, transactions).toFixed(2)
      setInitialBalance(txnBalance)
    } 
    setValues(prevState => {
      return {
        ...prevState,
        balance: txnBalance
      }
    })
  }, [transactions, data])

  useEffect(() => {
    if (data) {
      const {name, currency} = data
      setValues(prevState => {
        return {
          ...prevState,
          name,
          currency
        }
      })
    }
  }, [data])

  if (!user) 
    return null 

  const handleChange = (event: any) => {
    console.log(event.target.value)
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
    const id = data ? data.id : newDatabaseId(accounts)

    try {
      const res = await supabase
        .from('accounts')
        .upsert({
          id,
          name: values.name,
          currency: values.currency,
        })

      if (res.error) {
        console.error(res.error)
        throw new Error()
      } else if (values.balance !== initialBalance) {
        const increase = values.balance > initialBalance
        const amount = increase ? values.balance - initialBalance : initialBalance - values.balance
        const newTxnId = newDatabaseId(transactions)
        const updateCat = categories.find((c: any) => c.name == 'Update')
        if (updateCat) {
          const txnRes = await supabase
          .from('transactions')
          .upsert({
            id: newTxnId,
            amount,
            currency: values.currency,
            cat: updateCat.id,
            from: increase ? null : id,
            to: !increase ? null : id,
            uid: user.id
          })
          if (txnRes.error) {
            console.error(txnRes.error)
            throw new Error()
          }
        } else {
          throw new Error('no Update Category')
        }
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
          .from('accounts')
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
          <div className='mb-1'><span className='text-xs text-gray-400'>Name</span></div>
          <input 
            className='w-full input text-xl' 
            name='name'
            value={values.name} 
            onChange={handleChange} />
        </div>
        <div className='mb-2'>
          <div className='mb-1'><span className='text-xs text-gray-400'>Amount</span></div>
          <div className='flex -mx-2'>
            <div className='px-2 w-2/3'>
              <input 
                className='w-full input text-xl' 
                name='balance' 
                value={values.balance}
                inputMode="decimal"
                type='number'
                step="0.01"
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
        <div className='my-6'>
          <button className='button py-6 text-xl w-full' onClick={handleSave}>Save</button>
        </div>
        <div className=''>
          <button className='button text-xl w-full' onClick={handleDelete}>Delete</button>
        </div>
      </form>
      {loading &&
        <div className='fixed inset-0 bg-white bg-opacity-20'></div>
      }
    </div>
  )
};

export default Account
