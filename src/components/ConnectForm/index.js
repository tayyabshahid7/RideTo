import React from 'react'
import styles from './styles.scss'
import { getAge } from 'utils/helper'
import classnames from 'classnames'

export function ConnectInput({
  label,
  type = 'text',
  onChange,
  value,
  id,
  name,
  disabled,
  required
}) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id || name}>
        {label}
      </label>
      <input
        name={name}
        className={styles.input}
        id={id || name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
    </div>
  )
}

export function ConnectAgeInput({
  label,
  onChange,
  value,
  id,
  name,
  disabled,
  required
}) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id || name}>
        {label}
      </label>
      <div className={styles.ageInputGroup}>
        <input
          name={name}
          className={styles.input}
          id={id || name}
          type="date"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
        {value && <div className={styles.age}>({getAge(value)})</div>}
      </div>
    </div>
  )
}

export function ConnectSelect({
  label,
  onChange,
  selected,
  id,
  name,
  placeholder,
  options,
  labelField = 'name',
  valueField = 'id',
  disabled,
  required
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label} htmlFor={id || name}>
          {label}
        </label>
      )}
      <select
        className={styles.select}
        name={name}
        id={id || name}
        value={selected}
        onChange={e =>
          onChange(
            e.target.value,
            e.target.options[e.target.selectedIndex].innerText
          )
        }
        disabled={disabled}
        required={required}>
        {placeholder && (
          <option disabled value="">
            {typeof placeholder === 'boolean' ? 'Select' : placeholder}
          </option>
        )}
        {options.map(opt => (
          <option
            key={opt[valueField]}
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

export function ConnectLabeledContent({ label, children, disabled }) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.input} disabled={disabled}>
        {children}
      </div>
    </div>
  )
}

export function Button({
  type = 'button',
  children,
  color = 'primary',
  onClick,
  disabled,
  small
}) {
  return (
    <button
      className={classnames(
        styles.button,
        styles[`button${color.charAt(0).toUpperCase()}${color.slice(1)}`],
        small && styles.buttonSmall
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}
