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
  staffId,
  staff,
  isAdmin,
  loadCourses
}) {
  return (
    <div className={styles.coursesPanel}>
      {!addingOrder && (
        <div className={styles.panel}>
          <div className={styles.title}>Staff</div>

          <div>
            {staff.map(item => (
              <StaffPanelItem
                key={item.id}
                date={date}
                event={item}
                staffId={staffId}
              />
            ))}
          </div>

          {isAdmin && (
            <Link
              className={styles.addButton}
              to={`/calendar/staff/create?date=${date}`}>
              Add Staff
            </Link>
          )}
        </div>
      )}

      <div className={styles.panel}>
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
              canEdit={isAdmin}
              loadCourses={loadCourses}
            />
          ))}

        {!addingOrder && isAdmin && (
          <Link
            className={styles.addButton}
            to={`/calendar/courses/create?date=${date}`}>
            Add course
          </Link>
        )}
      </div>

      {!addingOrder && (
        <div className={styles.panel}>
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
            className={styles.addButton}
            to={`/calendar/events/create?date=${date}`}>
            Add event
          </Link>
        </div>
      )}
    </div>
  )
}

export default CoursesPanel
