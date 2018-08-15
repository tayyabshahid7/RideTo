import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import CoursesPanelItem from './CoursesPanelItem'
import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  render() {
    let { courses, date } = this.props
    const title = moment(date, 'YYYY-MM-DD').format('dddd Do MMMM YYYY')
    return (
      <div className={styles.coursesPanel}>
        <h3>{title}</h3>
        <div className={styles.scrollContainer}>
          <div className={styles.scrollContent}>
            {courses.map(course => (
              <CoursesPanelItem key={course.time} date={date} course={course} />
            ))}
            <Link to={`/calendar/course/create`}>
              <Button color="primary">Add Course</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default CoursesPanel
