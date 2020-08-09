import React, { useEffect } from 'react'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'
import vhCheck from 'vh-check'
import { Mobile } from 'common/breakpoints'

vhCheck()

function CalendarMonthView(props) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  const weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className={styles.container}>
      <div className={styles.daysContainer}>
        <Mobile>
          <div className={styles.weekNames}>
            {weeks.map((x, index) => (
              <span key={index}>{x}</span>
            ))}
          </div>
        </Mobile>
        <CalendarDays {...props} />
      </div>
    </div>
  )
}

export default CalendarMonthView
