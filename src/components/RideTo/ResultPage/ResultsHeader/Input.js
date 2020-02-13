import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'
import searchSmall from 'assets/icons/SearchSmall.svg'
import dropdownSmall from 'assets/icons/DropdownSmall.svg'
import calendar from 'assets/icons/Calendar.svg'

const InputIcon = ({ icon, onClick }) => {
  switch (icon) {
    case 'search':
      return (
        <button type="submit" className={styles.button}>
          <img src={searchSmall} alt="search icon" />
        </button>
      )
    case 'date':
      return (
        <button type="button" className={styles.button} onClick={onClick}>
          <img src={calendar} alt="calendar icon" />
        </button>
      )
    default:
      return (
        <span className={classnames(styles.button, styles.chev)}>
          <img src={dropdownSmall} alt="dropdown icon" />
        </span>
      )
  }
}
function Input({
  value,
  label,
  select,
  options,
  onChange,
  onSubmit,
  icon,
  disabled,
  button,
  onClick,
  className,
  fullWidth
}) {
  return (
    <div
      className={classnames(
        styles.formGroup,
        className,
        fullWidth && styles.fullWidth
      )}>
      <form className={classnames(styles.formGroupForm)} onSubmit={onSubmit}>
        <label className={styles.clickable}>
          <span className={styles.label}>{label}</span>

          {select ? (
            <select className={styles.input} value={value} onChange={onChange}>
              {options.map(
                ({ constant, name }) =>
                  AVAILABLE_COURSE_TYPES.includes(constant) && (
                    <option key={constant} value={constant}>
                      {name}
                    </option>
                  )
              )}
            </select>
          ) : button ? (
            <button
              type="button"
              className={classnames(styles.input, button && styles.inputButton)}
              onClick={onClick}>
              <span>{value}</span>
            </button>
          ) : (
            <input
              value={value}
              className={styles.input}
              onChange={onChange}
              disabled={disabled}
            />
          )}
        </label>
        <InputIcon icon={icon} onClick={onClick} />
      </form>
    </div>
  )
}

export default Input
