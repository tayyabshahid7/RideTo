import React from 'react'
import Input from 'components/RideTo/Input'
import styles from './styles.scss'

const AddressForm = ({ address, onChange }) => {
  const handleChange = event => {
    const { name, value } = event.target
    onChange({ [name]: value })
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Input
          placeholder="Address"
          name="address_1"
          value={address.address_1}
          className={styles.input}
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Address 2"
          name="address_2"
          value={address.address_2}
          className={styles.input}
          onChange={handleChange}
        />
        <Input
          placeholder="Town/City"
          name="city"
          value={address.city}
          className={styles.input}
          onChange={handleChange}
        />
        <Input
          placeholder="County"
          name="county"
          value={address.county}
          className={styles.input}
          onChange={handleChange}
        />
        <Input
          placeholder="Postcode"
          name="postcode"
          value={address.postcode}
          className={styles.input}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default AddressForm
