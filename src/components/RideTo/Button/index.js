import React from 'react'
import classnames from 'classnames'

import styles from './Button.scss'

const Button = ({ children, href, className, onClick, target = null }) => {
  const classes = classnames(styles.button, className)

  return href ? (
    <a href={href} className={classes} target={target}>
      {children}
    </a>
  ) : (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export default Button
