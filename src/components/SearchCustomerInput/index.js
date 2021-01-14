import React, { useEffect, useState } from 'react'
import { ConnectReactSelectAsync } from 'components/ConnectForm'
import { searchInvoiceCustomer } from 'services/customer'
import debounce from 'debounce-promise'

const SearchCustomerInput = ({ value, onChange }) => {
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    if (value && !customer) {
      setCustomer(value)
    }
  }, [value])

  const handleChangeOption = value => {
    setCustomer(value)
    if (onChange) {
      onChange(value)
    }
  }

  const handleSearch = async inputValue => {
    const params = {
      ordering: 'updated_at',
      search: inputValue
    }
    const result = await searchInvoiceCustomer(params)
    const tmp = result.results.map(x => ({
      id: x.id,
      name: `${x.first_name} ${x.last_name}`,
      email: x.rideto_email,
      orders: x.orders
    }))

    return tmp
  }

  const getAsyncOptions = inputValue => {
    return new Promise(async (resolve, reject) => {
      const result = await handleSearch(inputValue)
      resolve(result)
    })
  }

  const loadOptions = inputValue => getAsyncOptions(inputValue)
  const debouncedLoadOptions = debounce(loadOptions, 500, {
    leading: true
  })

  return (
    <ConnectReactSelectAsync
      value={customer}
      loadOptions={inputValue => debouncedLoadOptions(inputValue)}
      onChange={handleChangeOption}
      size="big"
      isMulti={false}
      closeMenuOnSelect={true}
    />
  )
}

export default SearchCustomerInput
