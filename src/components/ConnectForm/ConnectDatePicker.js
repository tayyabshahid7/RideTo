import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import enGB from 'date-fns/locale/en-GB'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
// import { range } from 'lodash'
import { useMediaQuery } from 'react-responsive'

registerLocale('en-GB', enGB)

const MobileDateInput = ({ value, onClick }) => (
  <div className={styles.customDateInput} onClick={onClick}>
    {value}
  </div>
)

// const years = range(1900, 2100)
// const months = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December'
// ]

export default function ConnectDatePicker({
  popperPosition = 'bottom-start',
  onChange,
  onCalendarChange,
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
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const handleChange = date => {
    onChange({
      target: {
        name: name,
        value: date && moment(date).format('YYYY-MM-DD'),
        ...(iso && { value: moment(date).toISOString() })
      }
    })
  }

  // const handleInnerChanged = date => {
  //   console.log('inner date', date)
  // }

  // const handleMonthChanged = month => {
  //   console.log('inner month', month)
  // }

  // const handleYearChanged = year => {
  //   console.log('inner year', year)
  // }

  // const getYear = date => {
  //   return moment(date).year()
  // }

  // const getMonth = date => {
  //   return moment(date).month()
  // }

  const handleCalendarChange = date => {
    onCalendarChange && onCalendarChange(date)
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
        // renderCustomHeader={({
        //   date,
        //   changeYear,
        //   changeMonth,
        //   decreaseMonth,
        //   increaseMonth,
        //   prevMonthButtonDisabled,
        //   nextMonthButtonDisabled
        // }) => (
        //   <div
        //     style={{
        //       margin: 10,
        //       display: 'flex',
        //       justifyContent: 'center'
        //     }}>
        //     <button
        //       onClick={event => {
        //         handleInnerChanged(event)
        //         decreaseMonth(event)
        //       }}
        //       disabled={prevMonthButtonDisabled}>
        //       {'<'}
        //     </button>
        //     <select
        //       value={getYear(date)}
        //       onChange={({ target: { value } }) => {
        //         handleYearChanged(value)
        //         changeYear(value)
        //       }}>
        //       {years.map(option => (
        //         <option key={option} value={option}>
        //           {option}
        //         </option>
        //       ))}
        //     </select>

        //     <select
        //       value={months[getMonth(date)]}
        //       onChange={({ target: { value } }) => {
        //         handleMonthChanged(months.indexOf(value))
        //         changeMonth(months.indexOf(value))
        //       }}>
        //       {months.map(option => (
        //         <option key={option} value={option}>
        //           {option}
        //         </option>
        //       ))}
        //     </select>

        //     <button
        //       onClick={event => {
        //         handleInnerChanged(event)
        //         increaseMonth(event)
        //       }}
        //       disabled={nextMonthButtonDisabled}>
        //       {'>'}
        //     </button>
        //   </div>
        // )}
        selected={date}
        onMonthChange={handleCalendarChange}
        onYearChange={handleCalendarChange}
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
        {...(isMobile && { customInput: <MobileDateInput /> })}
        locale="en-GB"
      />
    </React.Fragment>
  )
}
