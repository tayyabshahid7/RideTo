import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectColorInput(props) {
  const { label, id, name, value, onChange, noWrapLabel, disabled } = props
  const colors = [
    '#C6F6D5',
    '#FAF089',
    '#FEEBC8',
    '#B2F5EA',
    '#BEE3F8',
    '#C3DAFE',
    '#E9D8FD',
    '#FED7E2'
  ]

  const changeColor = color => () => {
    console.log(color)
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
        {colors.map((color, index) => (
          <span
            key={index}
            onClick={changeColor(color)}
            style={{ backgroundColor: color }}
            className={classnames(
              styles.colorItem,
              color === value && styles.activeColor
            )}></span>
        ))}
      </div>
    </div>
  )
}
