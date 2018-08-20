import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import CoursesPanelItem from './CoursesPanelItem'
import styles from './CoursesPanel.scss'
import { DAY_FORMAT2 } from '../../../common/constants'

class CoursesPanel extends React.Component {
  render() {
    let { courses, date } = this.props
    const title = moment(date, 'YYYY-MM-DD').format(DAY_FORMAT2)
    return (
      <div className={styles.coursesPanel}>
        <h3>{title}</h3>
        <div className={styles.scrollContainer}>
          <div className={styles.scrollContent}>
            {courses.map(course => (
              <CoursesPanelItem key={course.id} date={date} course={course} />
            ))}
            <div className="text-center">
              <Link to={`/calendar/courses/create?date=${date}`}>
                <Button color="primary">Add Course</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CoursesPanel
