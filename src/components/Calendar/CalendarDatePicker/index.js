import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.scss'
import Calendar from 'react-calendar'
import moment from 'moment'
import { CALENDAR_VIEW } from '../../../common/constants'

function CalendarDatePicker({ calendar, handleChangeDate }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const inputEl = useRef(null)
  const date = new Date(calendar.year, calendar.month, calendar.day)

  useEffect(() => {
    const handleClickOutside = event => {
      if (inputEl && !inputEl.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  let dateText = moment(date).format('MMMM YYYY')
  if (calendar.viewMode === CALENDAR_VIEW.DAY) {
    dateText = moment(date).format('ddd DD MMMM YYYY')
  } else if (calendar.viewMode === CALENDAR_VIEW.WEEK) {
    const weekStart = moment(date).startOf('isoWeek')
    const weekEnd = moment(date).endOf('isoWeek')
    if (weekStart.get('year') !== weekEnd.get('year')) {
      dateText =
        moment(weekStart).format('MMMM DD YYYY') +
        ' - ' +
        moment(weekEnd).format('MMMM DD YYYY')
    } else if (weekStart.get('month') !== weekEnd.get('month')) {
      dateText =
        moment(weekStart).format('MMMM DD') +
        ' - ' +
        moment(weekEnd).format('MMMM DD YYYY')
    } else {
      dateText =
        moment(weekStart).format('MMMM DD') +
        ' - ' +
        moment(weekEnd).format('DD YYYY')
    }
  }

  return (
    <div className={styles.container} ref={inputEl}>
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
