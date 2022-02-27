import { accountBalanceFromTransactions } from './calc'
import { StoreIF } from './store'
import { Transaction as T } from './types'

interface ActionIF {
  type: string 
  payload: any
} 

export const storeReducer = (state: StoreIF, action: ActionIF) => {
  switch(action.type) {
    case 'set data':
    {
      return {
        ...state,
        data: action.payload
      }
    }
    case 'set session':
    {
      return {
        ...state,
        session: action.payload
      }
    }
    case 'set transactions':
    {
      const transactions = action.payload.sort((a: T, b: T) => {
        const dateA = new Date(a.datetime)
        const dateB = new Date(b.datetime)
        const timeA = dateA.getTime()
        const timeB = dateB.getTime()
        if (timeA === timeB) {
          return b.amount - a.amount
        }
        return dateB.getTime() - dateA.getTime()
      })
      return {
        ...state,
        transactions
      }
    }
    case 'set accounts':
    {
      const accounts = action.payload.sort((a: any, b: any) => {
        const balanceA = accountBalanceFromTransactions(a.id, state.transactions)
        const balanceB = accountBalanceFromTransactions(b.id, state.transactions)
        return balanceB - balanceA
      })
      return {
        ...state,
        accounts
      }
    }
    case 'set categories':
    {
      return {
        ...state,
        categories: action.payload
      }
    }
    case 'insert transaction':
    {
      const updatedTransactions = [
        action.payload,
        ...state.transactions
      ]
      const transactions = updatedTransactions.sort((a: T, b: T) => {
        const dateA = new Date(a.datetime)
        const dateB = new Date(b.datetime)
        const timeA = dateA.getTime()
        const timeB = dateB.getTime()
        if (timeA === timeB) {
          return b.amount - a.amount
        }
        return dateB.getTime() - dateA.getTime()
      })
      const accounts = state.accounts.sort((a: any, b: any) => {
        const balanceA = accountBalanceFromTransactions(a.id, transactions)
        const balanceB = accountBalanceFromTransactions(b.id, transactions)
        return balanceB - balanceA
      }) 
      return {
        ...state,
        transactions,
        accounts
      }
    }
    case 'update transaction': 
    {
      const transactionIndex = state.transactions.findIndex((t: T) => t.id === action.payload.id)
      let updatedTransactions = [...state.transactions]
      updatedTransactions[transactionIndex] = action.payload
      const transactions = updatedTransactions.sort((a: T, b: T) => {
        const dateA = new Date(a.datetime)
        const dateB = new Date(b.datetime)
        const timeA = dateA.getTime()
        const timeB = dateB.getTime()
        if (timeA === timeB) {
          return b.amount - a.amount
        }
        return dateB.getTime() - dateA.getTime()
      })
      const accounts = state.accounts.sort((a: any, b: any) => {
        const balanceA = accountBalanceFromTransactions(a.id, transactions)
        const balanceB = accountBalanceFromTransactions(b.id, transactions)
        return balanceB - balanceA
      }) 
      return {
        ...state,
        transactions,
        accounts
      }
    }
    case 'delete transaction': 
    {
      const filteredTransactions = state.transactions.filter((t: any) => t.id !== action.payload)
      return {
        ...state,
        transactions: filteredTransactions
      }
    }
    case 'insert account': 
    {
      return {
        ...state,
        accounts: [
          action.payload,
          ...state.accounts
        ]
      }
    }
    case 'update account': 
    {
      let accountIndex = state.accounts.findIndex((a: any) => a.id === action.payload.id)
      let updatedAccounts = [...state.accounts]
      updatedAccounts[accountIndex] = action.payload
      return {
        ...state,
        accounts: updatedAccounts
      }
    }
    case 'delete account': 
    {
      const filteredAccounts = state.accounts.filter((a: any) => a.id !== action.payload)
      return {
        ...state,
        accounts: filteredAccounts
      }
    }
    case 'insert category': 
    {
      return {
        ...state,
        categories: [
          ...state.categories,
          action.payload
        ]
      }
    }
    case 'update category': 
    {
      let categoryIndex = state.categories.findIndex((c: any) => c.id === action.payload.id)
      let updatedCategories = [...state.categories]
      updatedCategories[categoryIndex] = action.payload
      return {
        ...state,
        categories: updatedCategories
      }
    }
    case 'delete category': 
    {
      const filteredCategories = state.categories.filter((c: any) => c.id !== action.payload)
      return {
        ...state,
        categories: filteredCategories
      }
    }
    default:
    {
      throw new Error()
    }
  }
}