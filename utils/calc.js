export const accountBalanceFromTransactions = (accountId, transactions) => transactions.reduce((calc, t) => {
  if (t.from === accountId) {
    return calc - t.amount
  } else if (t.to === accountId) {
    return calc + t.amount
  } else {
    return calc
  }
}, 0)

export const newDatabaseId = (records) => (records.reduce(
  (p, r) => {
    if (p < r.id) 
      return r.id 
    return p
  },
  0
) + 1)

export const newDatabaseOrder = (records) => (records.reduce(
  (p, r) => {
    if (p < r.order) 
      return r.order 
    return p
  },
  0
) + 1)
