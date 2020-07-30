import React, { useEffect } from 'react'
import CalendarShiftDays from '../CalendarShiftDays'
import styles from './index.scss'
import vhCheck from 'vh-check'

vhCheck()

function CalendarShiftView({ users, inactiveUsers, ...props }) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  const activeUsers = users.filter(
    x => x.id !== -1 && !inactiveUsers.includes(x.id)
  )

  return (
    <div className={styles.container}>
      <div className={styles.daysContainer}>
        <CalendarShiftDays activeUsers={activeUsers} {...props} />
      </div>
    </div>
  )
}

export default CalendarShiftView
