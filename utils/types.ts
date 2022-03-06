export interface Transaction {
  id: number,
  created_at: string,
  amount: number,
  datetime: string,
  from: number,
  to?: number | null,
  cat?: number | null,
  note?: string | null,
  currency: string
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
  emoji?: string,
  budget?: number,
  order: number,
  type?: string
}