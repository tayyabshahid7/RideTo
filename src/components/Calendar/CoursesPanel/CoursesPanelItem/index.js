import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Button } from 'reactstrap'

import { getShortCourseType } from 'services/course'
import OrdersPanelItem from 'components/Calendar/OrdersPanelItem'

import styles from './CoursesPanelItem.scss'

const CoursesPanelItem = ({ course, date }) => {
  const name = getShortCourseType(course.course_type)
  const availableSpaces = course.spaces - course.orders.length
  const className = classnames(
    styles.course,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger
  )
  const addLink = `/calendar/${date}/courses/${course.id}/edit`
  const { notes = '' } = course
  const truncated = notes.length > 200 ? `${notes}...` : notes

  return (
    <div className={styles.coursesPanelItem}>
      <div className={styles.heading}>
        <div className={className}>
          <div>
            {course.time} | {name}
          </div>
          {notes && <div className={styles.notes}>{truncated}</div>}
        </div>
        <Button
          tag={Link}
          outline
          color="primary"
          to={`/calendar/${date}/courses/${course.id}/edit`}>
          Edit
        </Button>
      </div>

      {course.orders.map(order => (
        <OrdersPanelItem key={order.id} order={order} />
      ))}

      {availableSpaces > 0 && (
        <div className={styles.actions}>
          <Button tag={Link} outline color="primary" to={addLink}>
            Add Order
          </Button>
        </div>
      )}
    </div>
  )
}

export default CoursesPanelItem
