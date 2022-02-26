import { useAppContext } from '../utils/store';
import CategoryItem from './CategoryItem'

const Categories: React.FC = () => {
  const { state: {categories} } = useAppContext()

  return (
    <div>
    {categories.length > 0 &&
      <ul>
        { 
          categories.map((txn: any) => <li key={txn.id}><CategoryItem data={txn} /></li>) 
        }
      </ul>
    }
  </div>
  )
};

export default Categories


