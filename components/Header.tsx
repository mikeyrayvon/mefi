import { useAppContext } from '../utils/store'
import { supabase } from '../utils/supabase'
import Container from './Container'

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    }
  }

  return (
    <header className='my-4'>
      <Container>
        <div className='flex justify-between align-center'>
          <h1>MyFi</h1>
          <div>
            {state.session &&
              <button className='button text-xs' onClick={() => signOut()}>Sign Out</button>
            }
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
