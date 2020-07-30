import React, { Component } from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import CalendarWeekStaff from '../CalendarWeekStaff'
import styles from './index.scss'

class CalendarUserLine extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const {
      day,
      history,
      calendar,
      match,
      settings,
      user,
      inactiveCourses
    } = this.props

    if (!day.courses) {
      return null
    }

    const courses = day.courses
      .filter(x => {
        if (user.id === -1) {
          return !x.instructor
        } else {
          return x.instructor && x.instructor.id === user.id
        }
      })
      .filter(x => x.course_type && !inactiveCourses.includes(x.course_type.id))

    const staffs = day.staff.filter(x => x.instructor === user.id)

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
          />
        ))}
        {staffs.map((staff, index) => (
          <CalendarWeekStaff
            staff={staff}
            position={day.coursePositions[index]}
            barCount={day.barCount}
            history={history}
            calendar={calendar}
            key={index}
            match={match}
            settings={settings}
          />
        ))}
      </div>
    )
  }
}

export default CalendarUserLine
