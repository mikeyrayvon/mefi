import { useAppContext } from '../utils/store';
import AccountItem from './AccountItem'

const Accounts: React.FC = () => {
  const { state: {accounts} } = useAppContext()

  return (
    <div>
    {accounts.length > 0 &&
      <ul>
        { 
          accounts.map((txn: any) => <li key={txn.id}><AccountItem data={txn} /></li>) 
        }
      </ul>
    }
  </div>
  )
};

export default Accounts


