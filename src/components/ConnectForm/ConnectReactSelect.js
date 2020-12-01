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
  isMulti = true,
  closeMenuOnSelect = true,
  labelField = 'name',
  valueField = 'id',
  size = 'normal',
  required,
  basic,
  textStyle = false,
  raw
}) {
  if (!options) {
    options = valueArray
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
      minHeight: size === 'normal' ? '32px' : '40px',
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
        isMulti={isMulti}
        name={name}
        id={id || name}
        options={options}
        styles={customStyles}
        value={selected || value || []}
        onChange={values => onChange(values)}
        placeholder={placeholder}
        getOptionLabel={option => option[labelField]}
        getOptionValue={option => option[valueField]}
        closeMenuOnSelect={closeMenuOnSelect}
      />
    </div>
  )
}
