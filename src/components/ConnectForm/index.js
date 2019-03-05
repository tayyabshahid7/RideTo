import React from 'react'
import styles from './styles.scss'
import { getAge } from 'utils/helper'

export function ConnectInput({
  label,
  type = 'text',
  onChange,
  value,
  id,
  name
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
      />
    </div>
  )
}

export function ConnectAgeInput({ label, onChange, value, id, name }) {
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
        />
        <div className={styles.age}>({getAge(value)})</div>
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
  disabled
}) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label} htmlFor={id || name}>
        {label}
      </label>
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
        }>
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
