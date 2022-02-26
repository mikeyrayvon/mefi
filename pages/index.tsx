import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import Container from '../components/Container'
import useSWR from 'swr'
import { supabase } from '../utils/supabase'
import { Auth } from '@supabase/ui'

const fetcher = (url: string, token: string) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Home: NextPage<{}> = ({ }) => {
  const { user, session } = Auth.useUser()
  const { data, error } = useSWR(session ? ['/api/getUser', session.access_token] : null, fetcher)
  const [authView, setAuthView] = useState('sign_in')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setAuthView('forgotten_password')
      if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
      // Send session to /api/auth route to set the auth cookie.
      // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
      /*fetch('/api/auth', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json())*/
    })

    return () => {
      if (authListener) {
        authListener.unsubscribe()
      }
    }
  }, [])
  
  return (
    <Layout>
      {!user ? (
        <div>
          <Container>
            <div className='bg-white p-4 rounded-md'>
              <Auth
                supabaseClient={supabase}
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
