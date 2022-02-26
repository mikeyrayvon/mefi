export interface Transaction {
  id: number,
  created_at: string,
  datetime: string,
  type: string,
  from: number,
  to?: number,
  cat?: number,
  note?: string
}

export interface Account {
  id: number,
  created_at: string,
  name: string,
  balance: number
}

export interface Category {
  id: number,
  created_at: string,
  name: string,
  balance: number
}