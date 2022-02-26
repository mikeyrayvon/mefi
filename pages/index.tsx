import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { useEffect, useContext } from 'react'
import { supabase } from '../utils/supabase'
import Auth from '../components/Auth'
import Dashboard from '../components/Dashboard'
import { useAppContext } from '../utils/store'

const Home: NextPage<{}> = ({ }) => {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'set session', payload: session })
    })
  }, [])
  
  return (
    <Layout>
      {!state.session ? <Auth /> : <Dashboard key={state.session?.user?.id} />}
    </Layout>
  )
}

export default Home
