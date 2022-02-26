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
    default:
      throw new Error()
  }
}