import Container from './Container'
import { Auth } from '@supabase/ui'
import { supabase } from '../utils/supabase'

const Header: React.FC = () => {
  const { user } = Auth.useUser()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    }
  }

  return (
    <header className='my-4'>
      <Container>
        <div className='flex justify-between items-center'>
          <div><span className='text-2xl mr-3'>😊</span><span>Happy Money</span></div>
          <div>
            {user &&
              <button className='button text-xs' onClick={() => signOut()}>Sign Out</button>
            }
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
