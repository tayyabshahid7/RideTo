import React from 'react'
import { Link } from 'react-router-dom'

import { getCourseSpaceText } from 'services/course'

import styles from './CoursesPanelItem.scss'

const CoursesPanelItem = ({ course, date }) => {
  return (
    <div className={styles.coursesPanelItem}>
      <div className={styles.time}>{course.time}</div>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.title}>
            {course.course_type.name} | {getCourseSpaceText(course)}
          </div>
          <Link to={`/calendar/${date}/orders/${course.id}`}>
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
                <td>{order.user_phone}</td>
                <td>{order.bike_hire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CoursesPanelItem
