import { createContext, useReducer, useContext } from 'react'
import { storeReducer } from './reducers'
import { Session } from '@supabase/supabase-js'

export interface StoreIF {
  data: any,
  session: Session | null,
  transactions: any,
  accounts: any,
  categories: any
}

const initialStoreState = {
  data: null,
  session: null,
  transactions : [],
  accounts: [],
  categories: []
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