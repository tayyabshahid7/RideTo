import React, { useState } from 'react'
import styles from './styles.scss'
import Calendar from 'react-calendar'
import moment from 'moment'

function CalendarDatePicker({
  calendar,
  handleChangeDate,
  showMonths = true,
  showYears = true
}) {
  const temp = moment()
  temp.set('year', calendar.year)
  temp.set('month', calendar.month)
  temp.set('date', calendar.day)
  const date = temp.toDate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleChange = date => {
    setShowDropdown(false)

    handleChangeDate({
      year: parseInt(moment(date).format('YYYY')),
      month: parseInt(moment(date).format('MM')) - 1,
      day: parseInt(moment(date).format('D'))
    })
  }

  const formatWeek = date => {
    return moment(date)
      .format('ddd')
      .substr(0, 1)
  }

  const dateText = moment(date).format('MMMM YYYY')

  return (
    <div className={styles.container}>
      <div
        className={styles.calendarText}
        onClick={() => setShowDropdown(!showDropdown)}>
        <span>{dateText}</span>
        <i className="fa fa-angle-down"></i>
      </div>
      {showDropdown && (
        <div className={styles.calendarDropdown}>
          <Calendar
            onChange={handleChange}
            value={date}
            formatShortWeekday={(locale, date) => formatWeek(date)}
          />
        </div>
      )}
    </div>
  )
}

export default CalendarDatePicker
