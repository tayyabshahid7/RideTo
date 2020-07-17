import React, { Component } from 'react'
import CalendarWeekCourse from '../CalendarWeekCourse'
import styles from './index.scss'

class CalendarUserLine extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const { day, history, calendar, match, settings } = this.props
    // const courses = day.courses.filter(x => x.instructor === user.id)
    const courses = day.courses

    return (
      <div className={styles.container}>
        {day.courses &&
          courses.length > 0 &&
          courses.map((course, index) => (
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
      </div>
    )
  }
}

export default CalendarUserLine
