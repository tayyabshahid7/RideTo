import React from 'react'

import styles from './Input.scss'

const Input = ({ className = '', ...rest }) => {
  const inputClass = `${className} ${styles.input}`

  return <input className={inputClass} {...rest} />
}

export default Input
