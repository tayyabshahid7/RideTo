import get from 'lodash/get'
import React, { memo, useEffect, useState } from 'react'
import { useGeolocated } from 'react-geolocated'
import { fetchBankHolidays } from 'services/course'
import { retrievePostCode } from 'services/postcode'

export const BankHolidayProvider = React.createContext()

export const ResultPageProvider = React.createContext()

function StateProvider({ children }) {
  const [bankHoliday, setBankHoliday] = useState([])
  const [currentLocation, setCurrentLocation] = useState({
    lat: 51.507359,
    lng: -0.136439
  })
  const [postcode, setPostcode] = useState('')
  const [courseType, setCourseType] = useState('')
  const [radiusMiles, setRadiusMiles] = useState(1)

  const { getPosition, timestamp, positionError, coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 30000
    },
    userDecisionTimeout: 60000,
    watchPosition: true,
    suppressLocationOnMount: true,
    onError: geoLocationError,
    onSuccess: geoLocationSuccess
  })

  function handleCourseTypeChange(courseType) {
    setCourseType(courseType)
  }

  function geoLocationError(err) {
    if (err) {
      setCurrentLocation({ lat: 51.507359, lng: -0.136439 })
      setPostcode('London')
    }
  }

  function geoLocationSuccess(position) {
    const { coords } = position
    const { latitude, longitude } = coords

    retrievePostCode(latitude, longitude).then(postcode => {
      setPostcode(postcode)
      setCurrentLocation({
        lat: latitude,
        lng: longitude
      })
    })
  }

  const getBankHolidays = async () => {
    const bankHolidays = await fetchBankHolidays()
    const results = get(bankHolidays, 'results', [])
    setBankHoliday(results)
  }

  useEffect(() => {
    getBankHolidays()
  }, [])

  function handlePostCodeChange(postcode) {
    setPostcode(postcode)
  }

  function handleMileRadiusChange(miles) {
    setRadiusMiles(miles)
  }

  return (
    <ResultPageProvider.Provider
      value={{
        currentLocation,
        postcode,
        handlePostCodeChange,
        getPosition,
        positionError,
        coords,
        timestamp,
        handleCourseTypeChange,
        courseType,
        radiusMiles,
        handleMileRadiusChange
      }}>
      <BankHolidayProvider.Provider value={{ bankHoliday }}>
        {children}
      </BankHolidayProvider.Provider>
    </ResultPageProvider.Provider>
  )
}

export default memo(StateProvider)
