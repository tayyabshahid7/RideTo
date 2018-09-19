import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

const NavigationItem = ({
  title,
  subtitle,
  active = false,
  disabled = false,
  onClick,
  showLeftBorder
}) => {
  return (
    <div
      className={classnames(
        styles.itemContainer,
        showLeftBorder && styles.leftBorder,
        active && styles.active
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
