import React from 'react'
import moment from 'moment'

import MapComponent from 'components/RideTo/MapComponent'
import { saveSupplierRating } from 'services/supplier'
import { showReview } from 'services/order'
import DashboardReview from 'components/RideTo/Account/DashboardReview'

import styles from './OrderDetails.scss'
const getFriendlyStatus = status => {
  if (status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION') {
    return 'Pending Instructor Confirmation'
  } else if (status === 'TRAINING_WAITING_RIDER_CONFIRMATION') {
    return 'Date Unavailable. Please check your email'
  } else if (status === 'TRAINING_CONFIRMED') {
    return 'Training Confirmed'
  } else if (status === 'TRAINING_CANCELLED') {
    return 'Training Cancelled'
  }
}

const renderRow = (title, content, index) => {
  return (
    <div className={styles.rowItem} key={index}>
      <div className={styles.subtitle}>{title}</div>
      <div>{content}</div>
    </div>
  )
}

const renderTraining = order => {
  if (order.source === 'RIDETO') {
    return renderRow('Status', getFriendlyStatus(order.training_status))
  } else {
    return order.trainings.map((training, key) => {
      return (
        <React.Fragment>
          <hr />
          {renderRow(
            training.course_type.replace('Full Licence ', ''),
            moment(`${training.date}T${training.time}`).format('llll')
          )}
          {renderRow('Status', getFriendlyStatus(training.status))}
        </React.Fragment>
      )
    })
  }
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
    const { training_location } = order
    await saveSupplierRating(training_location.id, rating)

    this.setState({
      reviewSubmitted: true
    })
  }

  render() {
    const { order } = this.props
    const { reviewSubmitted } = this.state
    const { training_location } = order
    const marker = {
      id: 1,
      lat: parseFloat(training_location.latitude),
      lng: parseFloat(training_location.longitude)
    }
    const date = moment(order.user_date, 'DD/MM/YYYY')
    const courseTitle = order.course_title

    return (
      <div className={styles.orderDetails}>
        <div className={styles.description}>
          <h4>Order #{order.friendly_id}</h4>

          <div className={styles.rowContainer}>
            {renderRow('Course', courseTitle)}
            {renderRow('Bike Type', order.bike_type)}
            {order.source === 'RIDETO' &&
              renderRow('Date & Time', date.format('ddd D, MMMM'))}
            {renderRow(
              'Location',
              `${training_location.town}, ${training_location.postcode}`
            )}
            {renderTraining(order)}
          </div>

          {showReview(order) && !reviewSubmitted && (
            <DashboardReview order={order} onSubmit={this.handleSubmit} />
          )}
        </div>

        <div className={styles.map}>
          <MapComponent courses={[marker]} width="auto" height={240} />
        </div>
      </div>
    )
  }
}

export default OrderDetails
