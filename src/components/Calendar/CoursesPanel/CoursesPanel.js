import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classnames from 'classnames'
import CoursesPanelItem from './CoursesPanelItem'
import AddCoursePackage from './CoursePackages/AddCoursePackage'
import EventPanelItem from './EventPanelItem'
import ShiftPanelItem from '../StaffShift/ShiftPanelItem'
import styles from './CoursesPanel.scss'
import { SHIFT_TYPES } from 'common/constants'

function CoursesPanel({
  courses,
  coursePackage,
  date,
  events = [],
  addingOrder,
  updateAdding,
  handleAddPackage,
  courseId,
  instructors,
  staff,
  isAdmin,
  schools,
  loadCourses
}) {
  const shifts = staff.filter(x => x.event_type === SHIFT_TYPES[0].id)

  events = events.sort((a, b) => {
    if (a.all_day) {
      return -1
    } else if (b.all_day) {
      return 1
    } else {
      return moment(a.start_time).valueOf() - moment(b.start_time).valueOf()
    }
  })

  if (coursePackage && coursePackage.adding) {
    return <AddCoursePackage date={date} courses={coursePackage.courses} />
  }

  return (
    <div className={styles.coursesPanel}>
      {!addingOrder && (
        <div className={styles.panel}>
          <div className={styles.title}>Staff</div>

          <div>
            {shifts.map(item => (
              <ShiftPanelItem
                key={item.id}
                date={date}
                instructors={instructors}
                diary={item}
                schools={schools}
                canEdit={isAdmin}
              />
            ))}
          </div>

          {isAdmin && (
            <Link
              className={styles.addButton}
              to={`/calendar/${date}/shifts/add`}>
              Add staff
            </Link>
          )}
        </div>
      )}

      <div className={classnames(!addingOrder && styles.panel)}>
        {!addingOrder && <div className={styles.title}>Courses</div>}

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
              handleAddPackage={handleAddPackage}
              canEdit={isAdmin}
              instructors={instructors}
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
                instructors={instructors}
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
