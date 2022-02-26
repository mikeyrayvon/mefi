interface Props {
  data: any
}

const Transaction: React.FC<Props> = ({ data }) => {
  return (
    <div className='border border-white rounded-lg p-4'>
      <div className='flex justify-between'>
        <div></div>
        <div>
          <span className='text-lg'>{data.amount.toFixed(2)} {data.currency.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
};

export default Transaction
