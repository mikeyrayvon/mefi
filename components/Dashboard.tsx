import Link from 'next/link'
import Container from './Container'
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../utils/supabase'
import { useAppContext } from '../utils/store'
import Transaction from './Transaction'

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)

  const { state: {session, transactions, accounts, categories}, dispatch } = useAppContext()

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true) 

    try {
      const txnsRes = await supabase
        .from('transactions')
        .select()
        .order('created_at')

      if (txnsRes.error && txnsRes.status !== 406) {
        throw txnsRes.error
      } else if (txnsRes.data) {
        dispatch({ type: 'set transactions', payload: txnsRes.data })
      }
      
      const acctsRes = await supabase
        .from('accounts')
        .select()

      if (acctsRes.error && acctsRes.status !== 406) {
        throw acctsRes.error
      } else if (acctsRes.data) {
        dispatch({ type: 'set accounts', payload: acctsRes.data })
      }

      const catsRes = await supabase
        .from('categories')
        .select()

      if (catsRes.error && catsRes.status !== 406) {
        throw catsRes.error
      } else if (catsRes.data) {
        dispatch({ type: 'set categories', payload: catsRes.data })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  /*
  useEffect(() => {
    const todoListener = supabaseClient
      .from("todos")
      .on("*", (payload) => {
        if (payload.eventType !== "DELETE") {
          const newTodo = payload.new;
          setTodos((oldTodos) => {
            const exists = oldTodos.find((todo) => todo.id === newTodo.id);
            let newTodos;
            if (exists) {
              const oldTodoIndex = oldTodos.findIndex(
                (obj) => obj.id === newTodo.id
              );
              oldTodos[oldTodoIndex] = newTodo;
              newTodos = oldTodos;
            } else {
              newTodos = [...oldTodos, newTodo];
            }
            newTodos.sort((a, b) => b.id - a.id);
            return newTodos;
          });
        }
      })
      .subscribe();

    return () => {
      todoListener.unsubscribe();
    };
  }, []);
  */

  return (
    <>
      <Container>        
        {loading ? (
          <div><span>Loading</span></div>
        ) : (
          <div>
            {transactions.length > 0 &&
              <ul>
                { 
                  transactions.map((txn: any) => <li key={txn.id}><Transaction data={txn} /></li>) 
                }
              </ul>
            }
          </div>
        )}
      </Container>
    </>
  )
};

export default Dashboard
