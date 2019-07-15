import React, { useState } from 'react'
import { ConnectInput, ConnectCheckbox, Button } from 'components/ConnectForm'
import styles from './styles.scss'

function PromoCode({ code: codeObj, updateCode, removeCode, submitCode }) {
  const {
    code,
    discount,
    num_of_uses_available,
    expire_date,
    is_active,
    id,
    isNew
  } = codeObj
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
        name="code"
        value={code}
        type="code"
        onChange={handleChange}
        maxlength="16"
      />
      <ConnectInput
        required
        label="Discount (£)"
        name="discount"
        value={discount}
        type="number"
        onChange={handleChange}
        min="0.00"
        max="10000.00"
        step="0.01"
        noWrapLabel
      />
      <ConnectInput
        required
        label="Uses"
        name="num_of_uses_available"
        value={num_of_uses_available}
        type="number"
        onChange={handleChange}
        min="0"
      />
      <ConnectInput
        required
        label="Expiry Date"
        name="expire_date"
        value={expire_date}
        type="date"
        onChange={handleChange}
        iso
        noWrapLabel
      />
      <ConnectCheckbox
        required
        label="Active"
        name="is_active"
        type="checkbox"
        checked={is_active}
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
