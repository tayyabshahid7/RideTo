import React from 'react'
import moment from 'moment'

import MapComponent from 'components/RideTo/MapComponent'
import { getCourseTitle } from 'services/course'
import { saveSupplierRating } from 'services/supplier'
import { showReview } from 'services/order'
import DashboardReview from 'components/RideTo/Account/DashboardReview'

import styles from './OrderDetails.scss'

const renderRow = (title, content, index) => {
  return (
    <div className={styles.rowItem} key={index}>
      <div className={styles.subtitle}>{title}</div>
      <div>{content}</div>
    </div>
  )
}

class OrderDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      reviewSubmitted: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(rating) {
    const { order } = this.props
    const { supplier } = order
    await saveSupplierRating(supplier.id, rating)

    this.setState({
      reviewSubmitted: true
    })
  }

  getFriendlyStatus(status) {
    if (status === 'WAITING_SCHOOL_CONFIRMATION') {
      return 'Pending Instructor Confirmation'
    } else if (status === 'SCHOOL_REJECTED_BOOK') {
      return 'Date Unavailable'
    } else if (status === 'SCHOOL_CONFIRMED_BOOK') {
      return 'Booking Confirmed'
    }
  }

  render() {
    const { order } = this.props
    const { reviewSubmitted } = this.state
    const { supplier } = order
    const marker = {
      id: 1,
      lat: parseFloat(supplier.latitude),
      lng: parseFloat(supplier.longitude)
    }
    const date = moment(order.user_date, 'DD/MM/YYYY')
    const courseTitle = getCourseTitle(order.selected_licence)

    return (
      <div className={styles.orderDetails}>
        <div className={styles.description}>
          <h4>Order #{order.friendly_id}</h4>

          <div className={styles.rowContainer}>
            {renderRow('Course', courseTitle)}
            {renderRow('Date & Time', date.format('ddd D, MMMM'))}
            {renderRow('Location', `${supplier.town}, ${supplier.postcode}`)}
            {renderRow('Status', this.getFriendlyStatus(order.booking_status))}
          </div>

          {showReview(order) &&
            !reviewSubmitted && (
              <DashboardReview order={order} onSubmit={this.handleSubmit} />
            )}
        </div>

        <div className={styles.map}>
          <MapComponent courses={[marker]} />
        </div>
      </div>
    )
  }
}

export default OrderDetails
