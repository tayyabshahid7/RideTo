import React from 'react'
import { ConnectInput, ConnectCheckbox, Button } from 'components/ConnectForm'
import styles from '../styles.scss'

function PromoCode({ code }) {
  const { text, price, uses, expireDate, active } = code

  const handleChange = ({ target }) => {
    console.log(target.value)
  }

  return (
    <form className={styles.promoForm}>
      <ConnectInput
        label="Code"
        name="text"
        value={text}
        type="text"
        onChange={handleChange}
      />
      <ConnectInput
        label="Price"
        name="price"
        value={price}
        type="number"
        onChange={handleChange}
      />
      <ConnectInput
        label="Uses"
        name="uses"
        value={uses}
        type="number"
        onChange={handleChange}
      />
      <ConnectInput
        label="Expiry Date"
        name="expireDate"
        value={expireDate}
        type="date"
        onChange={handleChange}
      />
      <ConnectCheckbox
        label="Active"
        name="active"
        type="checkbox"
        checked={active}
        onChange={handleChange}
      />
      <Button small type="submit">
        Save
      </Button>
      <Button color="link" small type="button">
        Delete
      </Button>
    </form>
  )
}

export default PromoCode
