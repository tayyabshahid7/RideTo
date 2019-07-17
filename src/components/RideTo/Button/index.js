import React from 'react'
import classnames from 'classnames'

import styles from './Button.scss'

const Button = React.forwardRef(
  ({ children, href, className, onClick, target = null, alt = false }, ref) => {
    const classes = classnames(
      styles.button,
      alt && styles.buttonAlt,
      className
    )

    return href ? (
      <a href={href} className={classes} target={target} ref={ref}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} className={classes} ref={ref}>
        {children}
      </button>
    )
  }
)

export default Button
