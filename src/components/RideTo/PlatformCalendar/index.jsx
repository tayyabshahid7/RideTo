import React, { useState } from 'react'
import { Calendar } from 'react-calendar'
import styles from './styles.scss'

export function PlatformCalendar(props) {
  const [calendarValue, setCalendarValue] = useState(new Date())

  function handleCalendarChange(e) {
    setCalendarValue(e)
  }
  return (
    <Calendar
      onChange={handleCalendarChange}
      value={calendarValue}
      locale="en-GB"
      next2Label={null}
      prev2Label={null}
      className={styles.calendar}
      showNeighboringMonth={false}
    />
  )
}
