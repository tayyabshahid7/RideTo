import React from 'react'
import styles from './index.scss'
import UserInitial from '../UserInitial'

const CalendarHeaderInstructors = ({ users, day, daysUser, isDay }) => {
  if (!users.length) {
    return null
  }

  return (
    <div className={styles.container}>
      {users.map(user => {
        if (daysUser.includes(user.id)) {
          return <UserInitial key={user.id} user={user} short={!isDay} wide />
        }
        return null
      })}
    </div>
  )
}

export default CalendarHeaderInstructors
