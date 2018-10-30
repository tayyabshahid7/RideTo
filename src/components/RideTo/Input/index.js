import React from 'react'
import classnames from 'classnames'

import styles from './Input.scss'

const Input = props => {
  const className = classnames(styles.input, props.className)

  return <input {...props} className={className} />
}

export default Input
