import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import moment from 'moment'
import UserInitial from '../../UserInitial'

import { getShortCourseType } from 'services/course'
import styles from './CourseSummary.scss'

const CourseSummary = ({
  course,
  date,
  addingOrder,
  courseId,
  schools,
  instructors,
  canEdit,
  canRemove,
  onRemove,
  embedded = true
}) => {
  const name = getShortCourseType(course.course_type)
  const availableSpaces = course.spaces_available
  const className = classnames(
    styles.course,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger
  )
  let { instructor } = course
  if (instructor) {
    instructor = instructors.find(x => x.id === instructor.id)
  }
  const isSelected = courseId && parseInt(courseId) === course.id

  const school = schools.find(x => x.id === course.supplier)
  const schoolName = school ? school.name : ''

  const renderDetail = () => (
    <React.Fragment>
      <div className={styles.line}>
        {canEdit ? (
          <Link
            className={styles.editButton}
            to={`/calendar/${date}/courses/${course.id}/edit`}>
            {name}
          </Link>
        ) : (
          <span className={styles.name}>{name}</span>
        )}
        {addingOrder ? (
          <span>
            {moment(course.date).format('ddd DD MMMM, ')}
            {course.time.substring(0, 5)}
          </span>
        ) : (
          <span>
            {course.time.substring(0, 5)} -{' '}
            {moment(`${course.date} ${course.time}`)
              .add(course.duration / 60, 'hours')
              .format('HH:mm')}
          </span>
        )}
      </div>
      <div className={styles.line}>
        <span>{schoolName}</span>
        {instructor && <UserInitial user={instructor} short right />}
      </div>
      {canRemove && (
        <div className={styles.line}>
          <span className={styles.link} onClick={onRemove}>
            Remove
          </span>
        </div>
      )}
    </React.Fragment>
  )

  if (embedded) {
    return renderDetail()
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={classnames(
          styles.heading,
          isSelected && styles.headingSelected
        )}>
        <div className={classnames(styles.container, className)}>
          {renderDetail()}
        </div>
      </div>
    </div>
  )
}

export default CourseSummary
