import Container from './Container'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAppContext } from '../utils/store'
import { Auth } from '@supabase/ui'

import TransactionList from './TransactionList'
import CategoryList from './CategoryList'
import AccountList from './AccountList'

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
    if (!user) {
      return
    }

    setLoading(true) 

    try {
      const transactionsRes = await supabase
        .from('transactions')
        .select()
        .eq('uid', user.id)
        .order('datetime', { ascending: false })

      if (transactionsRes.error && transactionsRes.status !== 406) {
        throw transactionsRes.error
      } else if (transactionsRes.data) {
        dispatch({ type: 'set transactions', payload: transactionsRes.data })
      }
      
      const accountsRes = await supabase
        .from('accounts')
        .select()
        .eq('uid', user.id)

      if (accountsRes.error && accountsRes.status !== 406) {
        throw accountsRes.error
      } else if (accountsRes.data) {
        dispatch({ type: 'set accounts', payload: accountsRes.data })
      }

      const categoriesRes = await supabase
        .from('categories')
        .select()
        .eq('uid', user.id)
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
    if (user) {
      const transactionsListener = supabase
        .from(`transactions:uid=eq.${user.id}`)
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
        .subscribe()

      const accountsListener = supabase
        .from(`accounts:uid=eq.${user.id}`)
        .on("*", (payload) => {
          if (payload.eventType === "INSERT") {
            dispatch({ type: 'insert account', payload: payload.new })
          }
          if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'update account', payload: payload.new })
          }
          if (payload.eventType === 'DELETE') {
            dispatch({ type: 'delete account', payload: payload.old.id })
          }
        })
        .subscribe()

      const categoriesListener = supabase
        .from(`categories:uid=eq.${user.id}`)
        .on("*", (payload) => {
          if (payload.eventType === "INSERT") {
            dispatch({ type: 'insert category', payload: payload.new })
          }
          if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'update category', payload: payload.new })
          }
          if (payload.eventType === 'DELETE') {
            dispatch({ type: 'delete category', payload: payload.old.id })
          }
        })
        .subscribe()

      return () => {
        transactionsListener.unsubscribe()
        accountsListener.unsubscribe()
        categoriesListener.unsubscribe()
      }
    }
  }, [user]);

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
              {listView === 'transactions' && transactions.length > 0 &&
                <TransactionList />
              }
              {listView === 'accounts' &&
                <AccountList />
              }
              {listView === 'categories' &&
                <CategoryList />
              }
            </div>
          </div>
        )}
      </Container>
    </>
  )
};

export default Dashboard
