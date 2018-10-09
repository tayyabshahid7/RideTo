import React from 'react'
import Input from 'components/RideTo/Input'
import styles from './styles.scss'

const AddressForm = ({ address, onChange, errors = {} }) => {
  const handleChange = event => {
    const { name, value } = event.target
    onChange(name, value)
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
        {errors.address_1 && (
          <div className={styles.error}>{errors.address_1}</div>
        )}
        <Input
          placeholder="Address 2"
          name="address_2"
          value={address.address_2}
          className={styles.input}
          onChange={handleChange}
        />
        {errors.address_2 && (
          <div className={styles.error}>{errors.address_2}</div>
        )}
        <Input
          placeholder="Town/City"
          name="town"
          value={address.town}
          className={styles.input}
          onChange={handleChange}
        />
        {errors.town && <div className={styles.error}>{errors.town}</div>}
        <Input
          placeholder="Postcode"
          name="postcode"
          value={address.postcode}
          className={styles.input}
          onChange={handleChange}
        />
        {errors.postcode && (
          <div className={styles.error}>{errors.postcode}</div>
        )}
      </div>
    </div>
  )
}

export default AddressForm
