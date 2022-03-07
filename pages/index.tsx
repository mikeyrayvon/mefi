import type { NextPage } from 'next'
import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard'
import Container from '../components/Container'
import { supabase } from '../utils/supabase'
import { Auth } from '@supabase/ui'

const Home: NextPage<{}> = ({ }) => {
  const { user, session } = Auth.useUser()
  
  return (
    <Layout>
      {!user ? (
        <div>
          <Container>
            <div className='bg-white p-4 rounded-md'>
              <Auth
                supabaseClient={supabase}
                magicLink={false}
                />
            </div>
          </Container>
        </div>
        
      ) : (
        <Dashboard />
      )}
    </Layout>
  )
}

export default Home
