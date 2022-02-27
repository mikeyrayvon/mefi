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
      let transactionIndex = state.transactions.findIndex((t: any) => t.id === action.payload.id)
      let updatedTransactions = [...state.transactions]
      updatedTransactions[transactionIndex] = action.payload
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
    case 'insert account': 
      return {
        ...state,
        accounts: [
          action.payload,
          ...state.accounts
        ]
      }
    case 'update account': 
      let accountIndex = state.accounts.findIndex((a: any) => a.id === action.payload.id)
      let updatedAccounts = [...state.accounts]
      updatedAccounts[accountIndex] = action.payload
      return {
        ...state,
        accounts: updatedAccounts
      }
    case 'delete account': 
      const filteredAccounts = state.accounts.filter((a: any) => a.id !== action.payload)
      return {
        ...state,
        accounts: filteredAccounts
      }
    case 'insert category': 
      return {
        ...state,
        categories: [
          ...state.categories,
          action.payload
        ]
      }
    case 'update category': 
      let categoryIndex = state.categories.findIndex((c: any) => c.id === action.payload.id)
      let updatedCategories = [...state.categories]
      updatedCategories[categoryIndex] = action.payload
      return {
        ...state,
        categories: updatedCategories
      }
    case 'delete category': 
      const filteredCategories = state.categories.filter((c: any) => c.id !== action.payload)
      return {
        ...state,
        categories: filteredCategories
      }
    default:
      throw new Error()
  }
}