import { useState } from 'react'
import { supabase } from '../utils/supabase'
import Container from './Container'

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-12'>
      <Container>
        <div className='flex'>
          <input
            className="input grow mr-2"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Send magic link'}</span>
          </button>
        </div>
      </Container>
    </div>
  )
};

export default Auth
