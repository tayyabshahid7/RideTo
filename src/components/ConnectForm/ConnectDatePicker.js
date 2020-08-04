import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import enGB from 'date-fns/locale/en-GB'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'

registerLocale('en-GB', enGB)

export default function ConnectDatePicker({
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
