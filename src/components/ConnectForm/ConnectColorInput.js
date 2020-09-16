import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { EVENT_COLORS } from 'common/constants'

export default function ConnectColorInput(props) {
  const { label, id, name, value, onChange, noWrapLabel, disabled } = props

  const changeColor = color => () => {
    onChange(color)
  }

  return (
    <div className={styles.formGroup}>
      {label && (
        <label
          className={classnames(
            styles.label,
            noWrapLabel && styles.labelNoWrap,
            disabled && styles.labelDisabled
          )}
          htmlFor={id || name}>
          {label}
        </label>
      )}
      <div className={styles.colorList}>
        {EVENT_COLORS.map((color, index) => (
          <span
            key={index}
            onClick={changeColor(color)}
            style={{ backgroundColor: color }}
            className={classnames(
              styles.colorItem,
              value && color === value.toUpperCase() && styles.activeColor
            )}></span>
        ))}
      </div>
    </div>
  )
}
