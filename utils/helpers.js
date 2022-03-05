export const formatDateStr = (d) => {
  const date = new Date(d)
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const getMonthName = (m) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  return monthNames[m]
}