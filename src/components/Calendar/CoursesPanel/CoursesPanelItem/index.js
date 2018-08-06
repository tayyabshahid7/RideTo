import React from 'react'
import { Link } from 'react-router-dom'

import { getCourseSpaceText } from 'services/course'
import { BikeHires, getTitleFor } from 'common/info'

import styles from './CoursesPanelItem.scss'

const CoursesPanelItem = ({ course, date }) => {
  let availableSpaces = course.spaces - course.orders.length
  return (
    <div className={styles.coursesPanelItem}>
      <div className={styles.time}>{course.time}</div>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.title}>
            {course.course_type.name} |{' '}
            <span
              className={
                availableSpaces === 0
                  ? 'text-danger'
                  : availableSpaces === 1
                    ? 'text-warning'
                    : ''
              }>
              {getCourseSpaceText(course)}
            </span>
          </div>
          <Link to={`/calendar/${date}/courses/${course.id}`}>
            Edit / Add Order
          </Link>
        </div>

        <table className={styles.orders}>
          <tbody>
            {course.orders.map(order => (
              <tr className={styles.order} key={order.friendly_id}>
                <td>
                  <strong>#{order.friendly_id}</strong>
                </td>
                <td>{order.user_name}</td>
                <td>{getTitleFor(BikeHires, order.bike_hire)}</td>
                <td>{order.user_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CoursesPanelItem
