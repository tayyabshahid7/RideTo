import React from 'react'
import classnames from 'classnames'

import styles from './Button.scss'

const Button = React.forwardRef(
  (
    {
      children,
      href,
      className,
      onClick,
      target = null,
      alt = false,
      modern = false,
      id
    },
    ref
  ) => {
    const classes = classnames(
      styles.button,
      alt && styles.buttonAlt,
      modern && styles.buttonModern,
      className
    )

    return href ? (
      <a href={href} className={classes} target={target} ref={ref} id={id}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} className={classes} ref={ref} id={id}>
        {children}
      </button>
    )
  }
)

export default Button
