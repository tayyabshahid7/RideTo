import React from 'react'
import { Link } from 'react-router-dom'
import CoursesPanelItem from './CoursesPanelItem'
import EventPanelItem from './EventPanelItem'
import ShiftPanelItem from '../StaffShift/ShiftPanelItem'
import styles from './CoursesPanel.scss'
import { SHIFT_TYPES } from 'common/constants'

function CoursesPanel({
  courses,
  date,
  events = [],
  addingOrder,
  updateAdding,
  courseId,
  eventId,
  staff,
  isAdmin,
  schools,
  loadCourses
}) {
  const shifts = staff.filter(x => x.event_type === SHIFT_TYPES[0].id)

  return (
    <div className={styles.coursesPanel}>
      {!addingOrder && (
        <div className={styles.panel}>
          <div className={styles.title}>Shift</div>

          <div>
            {shifts.map(item => (
              <ShiftPanelItem key={item.id} date={date} diary={item} />
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
                schools={schools}
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
