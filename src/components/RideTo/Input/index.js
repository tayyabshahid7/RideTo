import React from 'react'
import classnames from 'classnames'

import styles from './Input.scss'

const Input = props => {
  const className = classnames(styles.input, props.className)
  const { label } = props

  if (label) {
    return (
      <label className={styles.label}>
        <span className={styles.spanLabel}>{label}</span>
        <input {...props} className={className} placeholder="" />
      </label>
    )
  }

  return <input {...props} className={className} />
}

export default Input
