import React from 'react'
import classnames from 'classnames'

import styles from './styles.scss'

const Select = ({ children, ...props }) => {
  const className = classnames(styles.select, props.className)

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
