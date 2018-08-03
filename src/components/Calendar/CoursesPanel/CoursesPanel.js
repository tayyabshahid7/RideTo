import React from 'react'
import moment from 'moment'

import CoursesPanelItem from './CoursesPanelItem'
import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  render() {
    let { courses, date } = this.props
    const title = moment(date, 'YYYY-MM-DD').format('dddd Do MMMM YYYY')
    return (
      <div className={styles.coursesPanel}>
        <h3>{title}</h3>

        <div className={styles.courses}>
          {courses.map(course => (
            <CoursesPanelItem key={course.time} date={date} course={course} />
          ))}
        </div>
      </div>
    )
  }
}

export default CoursesPanel
