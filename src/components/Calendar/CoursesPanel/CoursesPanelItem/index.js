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
          <Link to={`/calendar/${date}/order/${course.id}`}>
            Edit / Add Order
          </Link>
        </div>

        <div className={styles.orders}>
          {course.orders.map(order => (
            <div className={styles.order}>
              <strong>{order.friendly_id}</strong>
              <span>{order.user_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CoursesPanelItem
