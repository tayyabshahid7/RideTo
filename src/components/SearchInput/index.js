import React from 'react'
import classnames from 'classnames'

import styles from './styles.scss'

const SearchInput = ({
  value = '',
  onChange,
  placeholder = '',
  noLabel = false
}) => {
  const handleChange = event => {
    onChange(event.target.value)
  }

  return (
    <div className={styles.container}>
      {!noLabel && <label className={styles.label}>Search</label>}
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
