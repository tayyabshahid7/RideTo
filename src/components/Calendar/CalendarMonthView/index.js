import React, { useEffect } from 'react'
import CalendarWeekdays from '../CalendarWeekdays'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'
import vhCheck from 'vh-check'

console.log(vhCheck())

function CalendarMonthView(props) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  return (
    <div className={styles.container}>
      <CalendarWeekdays sideBarOpen={this.props.sideBarOpen} />
      <div className={styles.daysContainer}>
        <CalendarDays {...props} />
      </div>
    </div>
  )
}

export default CalendarMonthView
