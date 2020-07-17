import React, { useEffect } from 'react'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'
import vhCheck from 'vh-check'

vhCheck()

function CalendarMonthView(props) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.daysContainer}>
        <CalendarDays {...props} />
      </div>
    </div>
  )
}

export default CalendarMonthView
