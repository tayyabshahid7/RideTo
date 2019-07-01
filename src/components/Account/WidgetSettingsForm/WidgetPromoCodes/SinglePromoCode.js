import React, { useState } from 'react'
import { ConnectInput, ConnectCheckbox, Button } from 'components/ConnectForm'
import styles from './styles.scss'

function PromoCode({ code, updateCode, removeCode, submitCode }) {
  const { text, price, uses, expireDate, isActive, id, isNew } = code
  const [changed, setChanged] = useState(false)
  const isSaveable = changed || isNew

  const handleChange = event => {
    updateCode(event, id)
    setChanged(true)
  }

  return (
    <form
      className={styles.promoForm}
      onSubmit={event => {
        submitCode(event, id)
        setChanged(false)
      }}>
      <ConnectInput
        required
        label="Code"
        name="text"
        value={text}
        type="text"
        onChange={handleChange}
      />
      <ConnectInput
        required
        label="Price (£)"
        name="price"
        value={price}
        type="number"
        onChange={handleChange}
        min="0.00"
        max="10000.00"
        step="0.01"
      />
      <ConnectInput
        required
        label="Uses"
        name="uses"
        value={uses}
        type="number"
        onChange={handleChange}
      />
      <ConnectInput
        required
        label="Expiry Date"
        name="expireDate"
        value={expireDate}
        type="date"
        onChange={handleChange}
      />
      <ConnectCheckbox
        required
        label="Active"
        name="isActive"
        type="checkbox"
        checked={isActive}
        onChange={handleChange}
      />
      <Button small type="submit" disabled={!isSaveable}>
        {isSaveable ? 'Save' : 'Saved'}
      </Button>
      <Button
        color="link"
        small
        type="button"
        onClick={() => {
          removeCode(id)
        }}>
        Delete
      </Button>
    </form>
  )
}

export default PromoCode
