import React from 'react'
import { Link } from 'react-router-dom'

import CoursesPanelItem from './CoursesPanelItem'
import EventPanelItem from './EventPanelItem'
import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  render() {
    const { courses, date, events = [], addingOrder, updateAdding } = this.props

    return (
      <div className={styles.coursesPanel}>
        <div className={styles.courses}>
          <div className={styles.title}>Courses</div>

          {courses
            .filter(course => !addingOrder || course.id === addingOrder)
            .sort(({ time: timeA }, { time: timeB }) =>
              timeA.localeCompare(timeB)
            )
            .map(course => (
              <CoursesPanelItem
                key={course.id}
                date={date}
                course={course}
                addingOrder={addingOrder}
                updateAdding={updateAdding}
              />
            ))}

          {!addingOrder && (
            <Link
              className={styles.addCourse}
              to={`/calendar/courses/create?date=${date}`}>
              Add course
            </Link>
          )}
        </div>

        {!addingOrder && (
          <div className={styles.events}>
            <div className={styles.title}>Events</div>

            <div>
              {events.map(event => (
                <EventPanelItem key={event.id} date={date} event={event} />
              ))}
            </div>

            <Link
              className={styles.addEvent}
              to={`/calendar/events/create?date=${date}`}>
              Add event
            </Link>
          </div>
        )}
      </div>
    )
  }
}

export default CoursesPanel
