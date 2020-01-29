import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'

const InputIcon = ({ icon }) => {
  switch (icon) {
    case 'search':
      return (
        <button type="submit" className={styles.button}>
          <i className="fa fa-search"></i>
        </button>
      )
    case 'date':
      return (
        <button type="submit" className={styles.button}>
          <i className="fa fa-calendar"></i>
        </button>
      )
    default:
      return (
        <span className={classnames(styles.button, styles.chev)}>
          <i className="fa fa-chevron-down" />
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
              {value}
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
        <InputIcon icon={icon} />
      </form>
    </div>
  )
}

export default Input
