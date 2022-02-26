import { StoreIF } from './store'

interface ActionIF {
  type: string 
  payload: any
} 

export const storeReducer = (state: StoreIF, action: ActionIF) => {
  switch(action.type) {
    case 'set data':
      return {
        ...state,
        data: action.payload
      }
    case 'set session':
      return {
        ...state,
        session: action.payload
      }
    case 'set transactions':
      return {
        ...state,
        transactions: action.payload
      }
    case 'set accounts':
      return {
        ...state,
        accounts: action.payload
      }
    case 'set categories':
      return {
        ...state,
        categories: action.payload
      }
    case 'insert transaction': 
      return {
        ...state,
        transactions: [
          action.payload,
          ...state.transactions
        ]
      }
    case 'update transaction': 
      const updatedIndex = state.transactions.findIndex((t: any) => t.id === action.payload.id)
      let updatedTransactions = [...state.transactions]
      updatedTransactions[updatedIndex] = action.payload
      return {
        ...state,
        transactions: updatedTransactions
      }
    case 'delete transaction': 
      const filteredTransactions = state.transactions.filter((t: any) => t.id !== action.payload)
      return {
        ...state,
        transactions: filteredTransactions
      }
    default:
      throw new Error()
  }
}