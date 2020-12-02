import React, { useState } from 'react'
import { ConnectReactSelectAsync } from 'components/ConnectForm'
import { searchCustomer } from 'services/customer'

const SearchCustomerInput = ({ onChange }) => {
  const [customer, setCustomer] = useState(null)

  const handleChangeOption = value => {
    console.log(value)
    setCustomer(value)
    if (onChange) {
      onChange(value)
    }
  }

  const promiseOptions = inputValue => {
    return new Promise(async resolve => {
      const result = await searchCustomer(inputValue)
      console.log(result)
      resolve(result)
    })
  }

  return (
    <ConnectReactSelectAsync
      value={customer}
      onChange={handleChangeOption}
      size="big"
      isMulti={false}
      closeMenuOnSelect={true}
      promiseOptions={promiseOptions}
    />
  )
}

export default SearchCustomerInput
