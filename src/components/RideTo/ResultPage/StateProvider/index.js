import React, { memo, useState, useEffect } from 'react'
import { fetchBankHolidays } from 'services/course'
import get from 'lodash/get'

export const BankHolidayProvider = React.createContext()

function StateProvider({ children }) {
  const [bankHoliday, setBankHoliday] = useState([])

  const getBankHolidays = async () => {
    const bankHolidays = await fetchBankHolidays()
    const results = get(bankHolidays, 'results', [])
    setBankHoliday(results)
  }

  useEffect(() => {
    getBankHolidays()
  }, [])

  return (
    <BankHolidayProvider.Provider value={{ bankHoliday }}>
      {children}
    </BankHolidayProvider.Provider>
  )
}

export default memo(StateProvider)
