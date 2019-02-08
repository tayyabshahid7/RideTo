import React from 'react'

import MinimalSelect from 'components/MinimalSelect'
import styles from './BookingOption.scss'

const BookingOption = ({
  label,
  options,
  labelField = 'name',
  selected,
  onChange,
  placeholder
}) => {
  return (
    <div className={styles.bookingOption}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <MinimalSelect
        placeholder={placeholder}
        options={options}
        labelField={labelField}
        selected={selected}
        onChange={onChange}
      />
    </div>
  )
}

export default BookingOption
