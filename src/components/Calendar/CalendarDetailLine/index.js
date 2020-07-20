import React from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import styles from './index.scss'

const CalendarDetailLine = ({
  day,
  history,
  calendar,
  match,
  settings,
  inactiveCourses
}) => {
  if (!day.courses) {
    return null
  }

  let courses = day.courses.filter(
    x => x.course_type && !inactiveCourses.includes(x.course_type.id)
  )

  return (
    <div className={styles.container}>
      {courses.map((course, index) => (
        <CalendarWeekCourse
          course={course}
          position={day.coursePositions[index]}
          barCount={day.barCount}
          history={history}
          calendar={calendar}
          key={index}
          match={match}
          settings={settings}
          showDetail
        />
      ))}
    </div>
  )
}

export default CalendarDetailLine
