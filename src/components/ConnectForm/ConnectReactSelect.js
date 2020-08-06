import React from 'react'
import Select from 'react-select'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectReactSelect({
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
  disabled,
  labelField = 'name',
  valueField = 'id',
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
      <Select
        isMulti
        name={name}
        id={id || name}
        options={options}
        value={selected || value || []}
        onChange={values => onChange(values)}
        placeholder={placeholder}
        getOptionLabel={option => option[labelField]}
        getOptionValue={option => option[valueField]}
      />
    </div>
  )
}
