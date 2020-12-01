import React, { useCallback } from 'react'
import debounce from 'lodash/debounce'
import classnames from 'classnames'

import styles from './styles.scss'

const SearchInput = ({ value = '', onSearch, placeholder = '' }) => {
  const debounceChange = useCallback(
    debounce(value => {
      if (onSearch) {
        onSearch(value)
      }
    }, 500),
    []
  )

  const onChange = event => {
    event.persist()
    debounceChange(event.target.value)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Search</label>
      <div>
        <input
          type="text"
          defaultValue={value}
          placeholder={placeholder}
          className={classnames(styles.input)}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default SearchInput
