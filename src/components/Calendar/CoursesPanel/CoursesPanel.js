import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import CoursesPanelItem from './CoursesPanelItem'
import EventPanelItem from './EventPanelItem'
import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  render() {
    const { courses, date, events = [] } = this.props

    return (
      <div className={styles.coursesPanel}>
        <div className={styles.courses}>
          <div className={styles.title}>
            Courses
            {/*
            <Button
              tag={Link}
              to={`/calendar/courses/create?date=${date}`}
              color="primary">
              Add Course
            </Button>
            */}
          </div>

          {courses.map(course => (
            <CoursesPanelItem key={course.id} date={date} course={course} />
          ))}
        </div>

        <div className={styles.events}>
          <div className={styles.title}>
            Events
            <Button
              tag={Link}
              to={`/calendar/events/create?date=${date}`}
              outline
              color="primary">
              Add Event
            </Button>
          </div>

          {events.map(event => (
            <EventPanelItem key={event.id} date={date} event={event} />
          ))}
        </div>
      </div>
    )
  }
}

export default CoursesPanel
