import { useState, useEffect, useRef, useCallback } from 'react'
import { List, Spin } from 'antd'
import TextInput from 'src/components/Atomic/Form/TextInput'
import { debounce } from 'lodash'
import env from 'src/configs'

interface Coordinates {
  lat: number
  lng: number
}

interface Prediction {
  description: string
  place_id: string
}

declare global {
  interface Window {
    google: any
  }
}

const GooglePlacesAutocomplete = ({
  apiKey,
  onChange,
  value = '',
  placeholder = 'Search location...',
  disabled
}: {
  apiKey?: string
  onChange?: (address: string, coordinates: Coordinates) => void
  value?: string
  placeholder?: string
  disabled?: boolean
}) => {
  const [inputValue, setInputValue] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestIdRef = useRef(0)
  const placesRef = useRef<any>(null)
  const isSelect = useRef<boolean>(false)

  // Initialize Google Maps services
  useEffect(() => {
    const initializeServices = async () => {
      if (window.google && window.google.maps) {
        const { Place } = await window.google.maps.importLibrary('places')
        placesRef.current = Place
      }
    }

    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || env.ggKey}&libraries=places`
      script.async = true
      script.onload = initializeServices
      script.onerror = () => setError('Failed to load Google Maps')
      document.head.appendChild(script)
    } else {
      initializeServices()
    }
  }, [apiKey])

  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input || !placesRef.current) {
        setPredictions([])
        return
      }

      const currentRequestId = ++requestIdRef.current

      try {
        setLoading(true)
        setError('')

        const request = {
          textQuery: input,
          fields: ['displayName', 'location', 'businessStatus'],
          includedType: '',
          maxResultCount: 8,
          minRating: 2 // Specify a minimum rating.
        }
        const { places } = await placesRef.current.searchByText(request)

        if (places.length) {
          const newPredictions = places.map((place: any) => ({
            description: place.displayName,
            place_id: place.id,
            coordinates: {
              lat: place.location.lat(),
              lng: place.location.lng()
            }
          }))
          if (currentRequestId !== requestIdRef.current) return // Ignore stale requests
          setPredictions(newPredictions)
        } else {
          setError('No results found')
          setPredictions([])
        }
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch predictions')
        setLoading(false)
      }
    }, 300),
    []
  )

  const handleSelect = useCallback(
    async (place: any) => {
      if (!place || !place.place_id) {
        setError('Invalid place selected')
        return
      }

      setInputValue(place.description)
      setPredictions([])
      isSelect.current = true
      setError('')
      onChange?.(place.description, place.coordinates)
    },
    [onChange]
  )

  return (
    <div className='relative'>
      <TextInput
        value={inputValue}
        onChange={(e) => {
          isSelect.current = false
          setInputValue(e.target.value)
          fetchPredictions(e.target.value)
        }}
        placeholder={value ? value : placeholder}
        className=' focus:border-blue-500 w-full rounded-6px'
        onBlur={() => {
          if (!isSelect.current) {
            setInputValue(value)
            setPredictions([])
            setError('')
          }
        }}
        onFocus={() => {
          setInputValue('')
        }}
        disabled={disabled}
      />

      {loading && (
        <div className='absolute top-12 w-full z-10'>
          <Spin className='p-2 w-full' />
        </div>
      )}

      {!loading && predictions.length > 0 && (
        <List
          className='absolute top-10 w-full z-10 bg-[#0e234c] shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto'
          dataSource={predictions}
          renderItem={(item) => (
            <List.Item
              className='!px-4 py-4 hover:bg-[#F9FAFB1F] cursor-pointer transition-colors'
              onMouseDown={(e) => {
                e.preventDefault() // Prevent immediate blur
                isSelect.current = true
                handleSelect(item)
              }}
            >
              <span className='text-white-700 text-sm'>{item.description}</span>
            </List.Item>
          )}
        />
      )}

      {error && <div className='text-red-500 text-sm mt-1'>{error}</div>}
    </div>
  )
}

export default GooglePlacesAutocomplete
