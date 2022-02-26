import Container from './Container'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAppContext } from '../utils/store'
import Transactions from './Transactions'
import Accounts from './Accounts'
import Categories from './Categories'
import { Auth } from '@supabase/ui'

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [listView, setListView] = useState('transactions')
  const { user } = Auth.useUser()
  const { state: {transactions, accounts, categories}, dispatch } = useAppContext()

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true) 

    try {
      const transactionsRes = await supabase
        .from('transactions')
        .select()
        .order('created_at')

      if (transactionsRes.error && transactionsRes.status !== 406) {
        throw transactionsRes.error
      } else if (transactionsRes.data) {
        dispatch({ type: 'set transactions', payload: transactionsRes.data })
      }
      
      const accountsRes = await supabase
        .from('accounts')
        .select()

      if (accountsRes.error && accountsRes.status !== 406) {
        throw accountsRes.error
      } else if (accountsRes.data) {
        dispatch({ type: 'set accounts', payload: accountsRes.data })
      }

      const categoriesRes = await supabase
        .from('categories')
        .select()
        .order('order')

      if (categoriesRes.error && categoriesRes.status !== 406) {
        throw categoriesRes.error
      } else if (categoriesRes.data) {
        dispatch({ type: 'set categories', payload: categoriesRes.data })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const listener = supabase
      .from("transactions")
      .on("*", (payload) => {
        if (payload.eventType === "INSERT") {
          dispatch({ type: 'insert transaction', payload: payload.new })
        }
        if (payload.eventType === 'UPDATE') {
          dispatch({ type: 'update transaction', payload: payload.new })
        }
        if (payload.eventType === 'DELETE') {
          dispatch({ type: 'delete transaction', payload: payload.old.id })
        }
      })
      .subscribe();

    return () => {
      listener.unsubscribe();
    };
  }, []);

  return (
    <>
      <Container>        
        {loading ? (
          <div><span>Loading</span></div>
        ) : (
          <div>
            <div className='flex -mx-1 mb-3'>
              <div className='w-1/3 px-1'>
                <button 
                  className={`button text-xs w-full ${listView === 'transactions' ? 'bg-gray-700' : ''}`} 
                  onClick={() => setListView('transactions')}>Txns</button>
              </div>
              <div className='w-1/3 px-1'>
                <button 
                  className={`button text-xs w-full ${listView === 'accounts' ? 'bg-gray-700' : ''}`}
                  onClick={() => setListView('accounts')}>Accts</button>
              </div>
              <div className='w-1/3 px-1'>
                <button 
                  className={`button text-xs w-full ${listView === 'categories' ? 'bg-gray-700' : ''}`}
                  onClick={() => setListView('categories')}>Cats</button>
              </div>
            </div>
            <div>
              {listView === 'transactions' &&
                <Transactions />
              }
              {listView === 'accounts' &&
                <Accounts />
              }
              {listView === 'categories' &&
                <Categories />
              }
            </div>
          </div>
        )}
      </Container>
    </>
  )
};

export default Dashboard
