import React from 'react'
import classnames from 'classnames'

import styles from './styles.scss'

const Select = ({ children, label, ...props }) => {
  const className = classnames(styles.select, props.className)

  if (label) {
    return (
      <label className={styles.label}>
        <span className={styles.spanLabel}>{label}</span>
        <select
          {...props}
          className={classnames(
            className,
            styles.select,
            props.value ? null : styles.placeholder
          )}>
          {children}
        </select>
      </label>
    )
  }

  return (
    <select
      {...props}
      className={classnames(
        className,
        styles.select,
        props.value ? null : styles.placeholder
      )}>
      {children}
    </select>
  )
}

export default Select
