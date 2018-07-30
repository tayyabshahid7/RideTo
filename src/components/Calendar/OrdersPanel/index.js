import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getCoursesOnDay } from 'services/course'
import styles from './OrdersPanel.scss'

const OrdersPanel = ({ days, match }) => {
  const {
    params: { date, courseId }
  } = match
  const title = moment(date, 'YYYY-MM-DD').format('dddd Do MMMM YYYY')

  const courses = getCoursesOnDay(days, date)
  const course =
    courses.filter(({ id }) => id === parseInt(courseId, 10))[0] || {}
  const backLink = `/calendar/${date}`

  return (
    <div className={styles.ordersPanel}>
      <h3>
        {course.time} {title}
      </h3>
      <Link to={backLink}>&laquo; Back to day view</Link>

      <h4>Orders</h4>

      <div className={styles.orders} />
    </div>
  )
}

export default OrdersPanel
