import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectLabeledContent({
  label,
  children,
  disabled,
  basic,
  noWrapLabel
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label
          className={classnames(
            styles.label,
            noWrapLabel && styles.labelNoWrap,
            disabled && styles.labelDisabled
          )}>
          {label}
        </label>
      )}
      <div
        className={classnames(
          styles.input,
          styles.plainText,
          basic && styles.basic
        )}
        disabled={disabled}>
        {children}
      </div>
    </div>
  )
}
