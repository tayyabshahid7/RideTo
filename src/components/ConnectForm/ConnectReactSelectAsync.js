import React from 'react'
import AsyncSelect from 'react-select/async'
import styles from './styles.scss'

export default function ConnectReactSelectAsync({
  promiseOptions,
  onChange,
  selected,
  value,
  id,
  name,
  placeholder,
  isMulti = true,
  closeMenuOnSelect = true,
  labelField = 'name',
  valueField = 'id',
  size = 'normal'
}) {
  // ref: https://react-select.com/styles
  const customStyles = {
    option: (provided, state) => ({
      ...provided
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
  }

  return (
    <div className={styles.formGroup}>
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        isMulti={isMulti}
        name={name}
        id={id || name}
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
