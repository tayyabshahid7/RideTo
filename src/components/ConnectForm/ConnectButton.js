import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default function Button({
  type = 'button',
  children,
  color = 'primary',
  onClick,
  disabled,
  small,
  large,
  className,
  outline,
  ...rest
}) {
  return (
    <button
      {...rest}
      outline={outline ? outline.toString() : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classnames(
        className,
        styles.button,
        styles[`button${color.charAt(0).toUpperCase()}${color.slice(1)}`],
        small && styles.buttonSmall,
        large && styles.buttonLarge
      )}>
      {children}
    </button>
  )
}
