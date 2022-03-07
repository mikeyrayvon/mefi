import { useEffect, useState } from "react"
import { useAppContext } from "../utils/store"
import { supabase } from '../utils/supabase'
import { Auth } from '@supabase/ui'
import { FiPlus, FiMinus } from 'react-icons/fi'

interface Props {
  data?: any,
  close: () => void
}

const Settings: React.FC<Props> = ({ data, close }) => {
  const { user } = Auth.useUser()
  const { state: { settings } } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [secondaryCurrency, setSecondaryCurrency] = useState('')
  const [ values, setValues ] = useState<{
    primary_currency: string,
    secondary_currencies: string[] | [],
  }>({
    primary_currency: process.env.NEXT_PUBLIC_PRIMARY_CURRENCY ?? '',
    secondary_currencies: []
  })  

  useEffect(() => {
    if (settings) {
      const {primary_currency, secondary_currencies} = settings
      setValues({
        primary_currency,
        secondary_currencies
      })
    }
  }, [settings])

  if (!user) 
    return null 

  const handleChange = (event: any) => {
    setValues(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  const addSecondaryCurrency = (event: any) => {
    event.preventDefault()

    if (secondaryCurrency.length > 0) {
      setSecondaryCurrency('')
      setValues(prevState => {
        return {
          ...prevState,
          secondary_currencies: [
            ...prevState.secondary_currencies,
            secondaryCurrency.toUpperCase()
          ]
        }
      })
    }
  }

  const removeSecondaryCurrency = (event: any, code: string) => {
    event.preventDefault()

    setValues(prevState => {
      return {
        ...prevState,
        secondary_currencies: prevState.secondary_currencies.filter(curr => curr !== code) 
      }
    })
  }

  const handleSave = async (event: any) => {
    event.preventDefault()

    // Should improve validation here!
    if (values.primary_currency.length !== 3)
      return 

    setLoading(true)

    try {
      let rates = settings.rates ?? null 

      if (settings.primary_currency !== values.primary_currency && process.env.NEXT_PUBLIC_CURRENCY_API_KEY) {
        if (values.secondary_currencies.length > 0) {
          const conversionRes = await fetch(`https://api.currencyapi.com/v3/latest?` + new URLSearchParams({
              base_currency: values.primary_currency
            }), {
            method: 'GET',
            headers: new Headers({
              'apikey': process.env.NEXT_PUBLIC_CURRENCY_API_KEY,
            }),
            body: JSON.stringify(data),
          })

          if (conversionRes.status === 200) {
            const resJson = await conversionRes.json()
            rates = resJson.data
          } else {
            throw new Error()
          }
        }
      }
        
      const res = await supabase
        .from('settings')
        .upsert({
          uid: user.id,
          primary_currency: values.primary_currency.toUpperCase(),
          secondary_currencies: values.secondary_currencies,
          rates
        })

      if (res.error) {
        console.error(res.error)
        throw new Error()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      close()
    }
  }

  console.log(settings)

  return (
    <div className='pt-4'>
      <form>
        <div className='mb-2'>
          <div className='mb-1'>
            <span className='text-xs text-gray-400 block mb-1'>Primary Currency</span>
          </div>
          <input 
            className='w-full input text-xl uppercase' 
            name='primary_currency'
            value={values.primary_currency} 
            placeholder='EUR, USD, CHF...'
            onChange={handleChange} />
        </div>
        <div className='mb-2'>
          <div className='mb-1'>
            <span className='text-xs text-gray-400 block mb-1'>Secondary Currencies</span>
          </div>
          <ul>
            {values.secondary_currencies?.length > 0 &&
              values.secondary_currencies.map((curr, i) => {
                return (
                  <li className='mb-3' key={curr + i}>
                    <div className='flex -mx-1'>
                      <div className='grow px-1'>
                        <div className='w-full input text-xl uppercase flex justify-between items-center'>
                          <span>{curr}</span>
                          {settings.rates && settings.rates[curr] &&
                            <span className='text-sm'>1 {settings.primary_currency} = {settings.rates[curr].value} {curr}</span>
                          }
                        </div>
                      </div>
                      <div className='px-1'>
                        <button className='button h-full px-4 bg-gray-200 text-gray-800 text-xl' onClick={(e) => removeSecondaryCurrency(e, curr)}><FiMinus /></button>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <div className='flex -mx-1'>
            <div className='grow px-1'>
              <input 
                className='w-full input text-xl uppercase' 
                value={secondaryCurrency}
                onChange={(event) => setSecondaryCurrency(event.target.value)}
                placeholder='EUR, USD, CHF...' />
            </div>
            <div className='px-1'>
              <button className='button h-full px-4 bg-gray-200 text-gray-800 text-xl' onClick={addSecondaryCurrency}><FiPlus /></button>
            </div>
          </div>
        </div>
        <div className='my-6'>
          <button className='button py-6 text-xl w-full' onClick={handleSave}>Save</button>
        </div>
      </form>
      {loading &&
        <div className='fixed inset-0 bg-white bg-opacity-20'></div>
      }
    </div>
  )
};

export default Settings
