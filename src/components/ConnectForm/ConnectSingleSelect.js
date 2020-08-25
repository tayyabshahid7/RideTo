import React from 'react'
import Select from 'react-select'
import styles from './styles.scss'
import classnames from 'classnames'

export default function ConnectSingleSelect({
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

  if (value) {
    value = value.toString()
  }
  if (selected) {
    selected = selected.toString()
  }
  const innerValue = options.find(
    x =>
      x[valueField].toString() === value ||
      x[valueField].toString() === selected
  )

  const handleChange = value => {
    if (raw) {
      onChange({
        target: {
          name,
          value: value[valueField]
        }
      })
    } else {
      onChange(value[valueField])
    }
  }

  // ref: https://react-select.com/styles
  const customStyles = {
    option: (provided, state) => ({
      ...provided
      // borderBottom: '1px dotted pink',
      // color: state.isSelected ? 'red' : 'blue',
      // padding: 20
    }),
    control: provided => ({
      ...provided,
      borderRadius: 0,
      borderColor: '#e4e4e4',
      minHeight: '32px',
      fontSize: '11px',
      fontWeight: 500
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    indicatorsContainer: provided => ({
      ...provided,
      ' > div': {
        padding: '5px'
      }
    })
    // singleValue: (provided, state) => {
    //   const opacity = state.isDisabled ? 0.5 : 1
    //   const transition = 'opacity 300ms'

    //   return { ...provided, opacity, transition }
    // }
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
        isMulti={false}
        name={name}
        id={id || name}
        options={options}
        required={required}
        styles={customStyles}
        value={innerValue}
        onChange={value => handleChange(value)}
        placeholder={placeholder}
        getOptionLabel={option => option[labelField]}
        getOptionValue={option => option[valueField]}
      />
    </div>
  )
}
