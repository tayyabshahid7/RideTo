import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import CalendarDaycellCourse from '../CalendarDaycellCourse'
import styles from './index.scss'

const CalendarDayCell = ({ day, info }) => {
  const dateStr = moment(day.date).format('YYYY-MM-DD')

  return (
    <li
      className={classnames(
        styles.container,
        day.date.getMonth() !== info.month ? styles.otherMonth : ''
      )}>
      <Link className={styles.dayLink} to={`/calendar/${dateStr}`}>
        <div className={styles.date}>{day.date.getDate()}</div>
        {day.courses &&
          day.courses.length > 0 && (
            <div>
              <CalendarDaycellCourse course={day.courses[0]} />
              {day.courses.length > 1 && (
                <CalendarDaycellCourse course={day.courses[1]} />
              )}
              {day.courses.length > 2 && (
                <div>{day.courses.length - 2} more</div>
              )}
            </div>
          )}
      </Link>
    </li>
  )
}

export default CalendarDayCell
