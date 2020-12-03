import React, { useState } from 'react'
import { ConnectReactSelectAsync } from 'components/ConnectForm'
import { fetchFilteredOrders } from 'services/order'

const SearchOrderInput = ({ onChange }) => {
  const [order, setOrder] = useState(null)

  const handleChangeOption = value => {
    console.log(value)
    setOrder(value)
    if (onChange) {
      onChange(value)
    }
  }

  const promiseOptions = inputValue => {
    return new Promise(async resolve => {
      const params = {
        search: inputValue,
        page_size: 10,
        page: 1
      }
      const result = await fetchFilteredOrders(params)
      console.log(result)
      const tmp = result.results.map(x => ({
        id: x.id,
        name: x.id
      }))
      resolve(tmp)
    })
  }

  return (
    <ConnectReactSelectAsync
      value={order}
      onChange={handleChangeOption}
      size="big"
      isMulti={false}
      closeMenuOnSelect={true}
      promiseOptions={promiseOptions}
    />
  )
}

export default SearchOrderInput
