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
  popperPosition = 'bottom-start',
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
  const handleChange = date => {
    onChange({
      target: {
        name: name,
        value: date && moment.utc(date).format('YYYY-MM-DD'),
        ...(iso && { value: moment.utc(date).toISOString() })
      }
    })
  }

  let date = ''
  if (value) {
    date = moment(value, 'YYYY-MM-DD').toDate()
  }

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
        selected={date}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        required={required}
        showMonthDropdown
        showYearDropdown
        autoComplete="off"
        dropdownMode="select"
        popperPlacement={popperPosition}
        maxDate={maxDate}
        highlightDates={highlightDates}
        locale="en-GB"
      />
    </React.Fragment>
  )
}
