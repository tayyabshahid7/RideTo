import React from 'react'
import { Link } from 'react-router-dom'
import CoursesPanelItem from './CoursesPanelItem'
import EventPanelItem from './EventPanelItem'
import StaffPanelItem from './StaffPanelItem'
import styles from './CoursesPanel.scss'

function CoursesPanel({
  courses,
  date,
  events = [],
  addingOrder,
  updateAdding,
  courseId,
  eventId,
  staff
}) {
  return (
    <div className={styles.coursesPanel}>
      {!addingOrder && (
        <div className={styles.staff}>
          <div className={styles.title}>Staff</div>

          <div>
            {staff.map(item => (
              <StaffPanelItem
                key={item.id}
                date={date}
                event={item}
                eventId={eventId}
              />
            ))}
          </div>

          <Link
            className={styles.addEvent}
            to={`/calendar/staff/create?date=${date}`}>
            Add Staff
          </Link>
        </div>
      )}

      <div className={styles.courses}>
        <div className={styles.title}>Courses</div>

        {courses
          .filter(course => !addingOrder || course.id === addingOrder)
          .sort(({ time: timeA }, { time: timeB }) =>
            timeA.localeCompare(timeB)
          )
          .map(course => (
            <CoursesPanelItem
              courseId={courseId}
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
              <EventPanelItem
                key={event.id}
                date={date}
                event={event}
                eventId={eventId}
              />
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

export default CoursesPanel
