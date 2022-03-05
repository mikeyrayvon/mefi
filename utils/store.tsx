import { createContext, useReducer, useContext } from 'react'
import { storeReducer } from './reducers'
import { Session } from '@supabase/supabase-js'
import { Transaction as T, Account as A, Category as C } from './types'

export interface StoreIF {
  data: null
  session: Session | null
  transactions: T[]
  accounts: A[]
  categories: C[]
  monthlyTransactions: T[]
}

const initialStoreState = {
  data: null,
  session: null,
  transactions: [],
  accounts: [],
  categories: [],
  monthlyTransactions: []
}

const AppContext = createContext<{
  state: StoreIF
  dispatch: React.Dispatch<any>
}>({
  state: initialStoreState,
  dispatch: () => null
})

const AppProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer(storeReducer, initialStoreState);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => useContext(AppContext)

export { AppContext, AppProvider, useAppContext };