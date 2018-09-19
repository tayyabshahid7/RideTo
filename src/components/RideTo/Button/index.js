import React from 'react'
import classnames from 'classnames'

import styles from './Button.scss'

const Button = ({ children, href, className, onClick }) => {
  const classes = classnames(styles.button, className)

  return href ? (
    <a href={href} className={classes}>
      {children}
    </a>
  ) : (
    <a onClick={onClick} className={classes}>
      {children}
    </a>
  )
}

export default Button
