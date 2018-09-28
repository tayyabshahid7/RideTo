import React from 'react'
import classnames from 'classnames'
import styles from './NavigationItem.scss'

const NavigationItem = ({
  title,
  subtitle,
  active = false,
  disabled = false,
  fullWidth = false,
  onClick
}) => {
  return (
    <div
      className={classnames(
        styles.navigationItem,
        active && styles.active,
        fullWidth && styles.fullWidth
      )}
      onClick={() => {
        if (!disabled) {
          onClick()
        }
      }}>
      <div className={classnames(styles.title, disabled && styles.disabled)}>
        {title}
      </div>
      <div className={classnames(styles.subtitle, disabled && styles.disabled)}>
        {disabled ? '-' : subtitle}
      </div>
    </div>
  )
}

export default NavigationItem
