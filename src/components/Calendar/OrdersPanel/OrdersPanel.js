import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import OrdersPanelItem from './OrdersPanelItem'
import styles from './OrdersPanel.scss'
import OrdersPanelSpaceItem from './OrdersPanelSpaceItem'

class OrdersPanel extends React.Component {
  handleAdd() {}

  handleRemove() {}

  render() {
    let { course } = this.props
    const dateStr = moment(course.date, 'YYYY-MM-DD').format('dddd Do MMMM')
    const backLink = `/calendar/${course.date}`
    const availableSpaces = course.spaces - course.orders.length
    return (
      <div className={styles.ordersPanel}>
        <h3>
          {course.time} {course.course_type.name} {dateStr}
        </h3>
        <Link to={backLink}>&laquo; Back to day view</Link>
        {course.orders.length === 0 && (
          <button className="btn btn-danger pull-right btn-remove-course">
            Remove Course
          </button>
        )}
        <h4>Orders</h4>

        <div className={styles.orders}>
          {course.orders.map((order, index) => (
            <OrdersPanelItem order={order} key={index} />
          ))}
          {Array.apply(null, Array(availableSpaces)).map((val, index) => (
            <OrdersPanelSpaceItem
              onAdd={this.handleAdd.bind(this)}
              onRemove={this.handleRemove.bind(this)}
              key={index}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default OrdersPanel
