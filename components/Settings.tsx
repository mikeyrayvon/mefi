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
  const { state: { settings }, dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [secondaryCurrency, setSecondaryCurrency] = useState('')
  const [ values, setValues ] = useState<{
    primaryCurrency: string,
    secondaryCurrencies: string[] | [],
  }>({
    primaryCurrency: '',
    secondaryCurrencies: []
  })  

  useEffect(() => {
    if (settings) {
      const {primary_currency, secondary_currencies} = settings
      setValues({
        primaryCurrency: primary_currency,
        secondaryCurrencies: secondary_currencies
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
          secondaryCurrencies: [
            ...prevState.secondaryCurrencies,
            secondaryCurrency.toLowerCase()
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
        secondaryCurrencies: prevState.secondaryCurrencies.filter(curr => curr !== code) 
      }
    })
  }

  const handleSave = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    try {
      const res = await supabase
        .from('settings')
        .upsert({
          uid: user.id,
          primary_currency: values.primaryCurrency.toLowerCase(),
          secondary_currencies: values.secondaryCurrencies,
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

  return (
    <div className='pt-4'>
      <form>
        <div className='mb-2'>
          <div className='mb-1'>
            <span className='text-xs text-gray-400 block mb-1'>Primary Currency</span>
          </div>
          <input 
            className='w-full input text-xl uppercase' 
            name='primaryCurrency'
            value={values.primaryCurrency} 
            placeholder='EUR, USD, CHF...'
            onChange={handleChange} />
        </div>
        <div className='mb-2'>
          <div className='mb-1'>
            <span className='text-xs text-gray-400 block mb-1'>Secondary Currencies</span>
          </div>
          <ul>
            {values.secondaryCurrencies?.length > 0 &&
              values.secondaryCurrencies.map(curr => {
                return (
                  <li className='flex mb-3 -mx-1'>
                    <div className='grow px-1'>
                      <span className='block w-full input text-xl uppercase'>{curr}</span>
                    </div>
                    <div className='px-1'>
                      <button className='button h-full px-4 bg-gray-200 text-gray-800 text-xl' onClick={(e) => removeSecondaryCurrency(e, curr)}><FiMinus /></button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <div className='flex -mx-1'>
            <div className='grow px-1'>
              <input 
                className='w-full input text-xl' 
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
