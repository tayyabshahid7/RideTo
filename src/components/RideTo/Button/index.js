import React from 'react'
import classnames from 'classnames'

import styles from './Button.scss'

const Button = React.forwardRef(
  ({ children, href, className, onClick, target = null }, ref) => {
    const classes = classnames(styles.button, className)

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
