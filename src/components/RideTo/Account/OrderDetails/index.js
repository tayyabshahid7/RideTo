import { BikeHires } from 'common/info'
import DashboardReview from 'components/RideTo/Account/DashboardReview'
import MapComponent from 'components/RideTo/MapComponent'
import React from 'react'
import { formatBikeConstant } from 'common/info'
import moment from 'moment'
import { saveSupplierRating } from 'services/supplier'
import { showReview } from 'services/order'
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
  if (
    order.source === 'RIDETO' ||
    order.course_title.includes('Full Licence')
  ) {
    return renderRow('Status', getFriendlyStatus(order.training_status))
  } else {
    return order.trainings.map((training, key) => {
      return (
        <React.Fragment key={key}>
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
    const courseTitle = order.course_title || order.trainings[0].course_type
    const trainingBikeType =
      order.trainings && order.trainings[0] && order.trainings[0].bike_type

    return (
      <div className={styles.orderDetails}>
        <div className={styles.description}>
          <h4>Order #{order.friendly_id}</h4>

          <div className={styles.rowContainer}>
            {renderRow('Course', courseTitle)}
            {renderRow(
              'Bike Type',
              trainingBikeType
                ? BikeHires.find(
                    bike => bike.value === formatBikeConstant(trainingBikeType)
                  ).title
                : order.bike_type
            )}
            {order.source === 'RIDETO' &&
              order.trainings[0].training_date_time &&
              renderRow(
                'Date & Time',
                moment(order.trainings[0].training_date_time).format(
                  'h:mm a, ddd D, MMMM'
                )
              )}
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
