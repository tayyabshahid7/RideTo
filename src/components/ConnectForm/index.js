import React, { Component } from 'react'
import styles from './styles.scss'
import { getAge } from 'utils/helper'
import classnames from 'classnames'
import TimeField from 'react-simple-timefield'
import moment from 'moment'
import enGB from 'date-fns/locale/en-GB'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

registerLocale('en-GB', enGB)

function MyDatePicker({
  label,
  type = 'text',
  onChange,
  noWrapLabel,
  value,
  id,
  name,
  disabled,
  required,
  basic,
  maxDate,
  iso,
  highlightDates
}) {
  return (
    <React.Fragment>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .react-datepicker-wrapper { flex-grow: 1; width: 100% }
        .react-datepicker__current-month { display: none }
      `
        }}
      />
      <DatePicker
        name={name}
        className={classnames(
          styles.input,
          styles.datepicker,
          basic && styles.basic
        )}
        id={id || name}
        type="date"
        selected={value && new Date(value)}
        onChange={date => {
          onChange({
            target: {
              name: name,
              value: date && moment(date).format('YYYY-MM-DD'),
              ...(iso && { value: moment(date).toISOString() })
            }
          })
        }}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        required={required}
        showMonthDropdown
        showYearDropdown
        autoComplete="off"
        dropdownMode="select"
        maxDate={maxDate}
        highlightDates={highlightDates}
        locale="en-GB"
      />
    </React.Fragment>
  )
}

export function ConnectInput(props) {
  const {
    label,
    type = 'text',
    onChange,
    noWrapLabel,
    value,
    id,
    name,
    disabled,
    required,
    basic,
    ...rest
  } = props

  if (type === 'time') {
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
        <TimeField
          value={value}
          onChange={value => {
            onChange({
              target: {
                name,
                value
              }
            })
          }}
          input={
            <input
              name={name}
              className={classnames(styles.input, basic && styles.basic)}
              id={id || name}
              type="text"
              disabled={disabled}
              required={required}
            />
          }
        />
      </div>
    )
  }

  if (type === 'date') {
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
        <MyDatePicker {...props} />
      </div>
    )
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
      <input
        {...rest}
        name={name}
        className={classnames(styles.input, basic && styles.basic)}
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

export function ConnectAgeInput(props) {
  const { label, id, name, value, hideAge, noWrapLabel, disabled } = props

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
      <div className={styles.ageInputGroup}>
        <MyDatePicker {...props} maxDate={new Date()} />
        {value && !hideAge && (
          <div className={styles.age}>({getAge(value)})</div>
        )}
      </div>
    </div>
  )
}

export function ConnectSelect({
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

export function ConnectLabeledContent({
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

export function ConnectCheckbox({
  label,
  type = 'checkbox',
  disabled,
  checked = false,
  onChange,
  noWrapLabel,
  name,
  vertical = false
}) {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label
          className={classnames(
            styles.label,
            styles.labelCheckbox,
            vertical && styles.labelCheckboxVertical,
            disabled && styles.labelDisabled
          )}>
          <input
            name={name}
            checked={checked}
            type={type}
            disabled={disabled}
            onChange={onChange}
          />
          <span>{label}</span>
        </label>
      )}
    </div>
  )
}

export class ConnectTextArea extends Component {
  constructor(props) {
    super(props)

    this.el = React.createRef()

    this.setHeight = this.setHeight.bind(this)
  }

  setHeight() {
    const { autoHeight } = this.props
    const textarea = this.el.current

    if (autoHeight) {
      textarea.style.height = ''
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  componentDidMount() {
    this.setHeight()
  }

  render() {
    const {
      label,
      name,
      value,
      type,
      disabled,
      onChange,
      noWrapLabel,
      autoHeight,
      noBorder
    } = this.props

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
        <textarea
          ref={this.el}
          className={classnames(
            styles.textarea,
            autoHeight && styles.textareaAutoHeight,
            noBorder && styles.textareaNoBorder
          )}
          name={name}
          value={value}
          type={type}
          disabled={disabled}
          onChange={onChange}
          onInput={this.setHeight}
        />
      </div>
    )
  }
}

export function Button({
  type = 'button',
  children,
  color = 'primary',
  onClick,
  disabled,
  small,
  large,
  className,
  outline,
  ...rest
}) {
  return (
    <button
      {...rest}
      outline={outline ? outline.toString() : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classnames(
        className,
        styles.button,
        styles[`button${color.charAt(0).toUpperCase()}${color.slice(1)}`],
        small && styles.buttonSmall,
        large && styles.buttonLarge
      )}>
      {children}
    </button>
  )
}
