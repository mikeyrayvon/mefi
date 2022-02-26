import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import * as gtag from '../utils/gtag'
import { AppProvider } from '../utils/store'
import { Auth } from '@supabase/ui'
import { supabase } from '../utils/supabase'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
      <AppProvider>
        <Auth.UserContextProvider supabaseClient={supabase}>
          <Component {...pageProps} />
        </Auth.UserContextProvider>
      </AppProvider>
    
  )
}

export default App
