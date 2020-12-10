import React from 'react'
import classnames from 'classnames'

import styles from './styles.scss'

const SearchInput = ({ value = '', onChange, placeholder = '' }) => {
  const handleChange = event => {
    onChange(event.target.value)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Search</label>
      <div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          className={classnames(styles.input)}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default SearchInput
