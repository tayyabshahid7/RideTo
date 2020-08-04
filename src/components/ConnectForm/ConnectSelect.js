import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectSelect({
  label,
  onChange,
  noWrapLabel,
  selected,
  value,
  id,
  name,
  placeholder,
  options,
  valueArray,
  labelField = 'name',
  valueField = 'id',
  disabled,
  required,
  basic,
  textStyle = false,
  raw
}) {
  if (!options) {
    options = valueArray
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
      <select
        // defaultValue={placeholder && ''}
        className={classnames(
          styles.select,
          basic && styles.basic,
          textStyle && styles.textStyle
        )}
        name={name}
        id={id || name}
        value={selected || value || ''}
        onChange={e => {
          if (raw) {
            onChange(e)
          } else {
            onChange(
              e.target.value,
              e.target.options[e.target.selectedIndex].innerText,
              e.target.name
            )
          }
        }}
        disabled={disabled}
        required={required}>
        {placeholder && (
          <option disabled value="" data-placeholder>
            {typeof placeholder === 'boolean' ? 'Select' : placeholder}
          </option>
        )}
        {options.map(opt => (
          <option
            key={opt.key || opt[valueField]}
            disabled={!opt[valueField]}
            value={opt[valueField]}
            name={opt[labelField]}>
            {opt[labelField]}
          </option>
        ))}
      </select>
    </div>
  )
}
