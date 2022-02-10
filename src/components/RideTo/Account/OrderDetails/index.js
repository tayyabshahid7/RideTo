import { getToken, getUserProfile, isAuthenticated } from 'services/auth'

import { BikeHires } from 'common/info'
import DashboardReview from 'components/RideTo/Account/DashboardReview'
import MapComponent from 'components/RideTo/MapComponent'
import React from 'react'
import RideToButton from 'components/RideTo/Button'
import { cancelOrder } from 'services/user'
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

const renderTraining = (order, isCancelled) => {
  if (isCancelled) {
    return renderRow('Status', 'Training Cancelled')
  }
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
      reviewSubmitted: false,
      cancelButtonIsClicked: false,
      isOrderPending: false,
      messageCancelOrder: false,
      messageNoticePeriod: false,
      isOrderCancelled: false,
      message: '',
      showMessage: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancelOrder = this.handleCancelOrder.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { order } = this.props
    const constant = order.trainings[0].constant
    const training_status = order.trainings[0].status
    const training_date = moment(
      order.trainings[0].training_date_time
        ? order.trainings[0].training_date_time
        : order.trainings[0].requested_date,
      'YYYY-MM-DD'
    )
    const today = moment().startOf('day')
    const current_hour = moment().hour()
    const trainingPeriod = moment.duration(training_date.diff(today)).asDays()

    if (!isAuthenticated()) {
      this.setState({
        messageNoticePeriod: true,
        message:
          'ERROR! Unable to cancel course. Please, login to proceed this cancellation.',
        cancelButtonIsClicked: false
      })
      return
    }

    if (constant === 'FULL_LICENCE') {
      if (
        trainingPeriod <= 13 &&
        !training_status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION' &&
        !training_status === 'TRAINING_WAITING_RIDER_CONFIRMATION'
      ) {
        this.setState({
          messageNoticePeriod: true,
          message:
            'ERROR! Unable to cancel course as it is within the cancellation notice period',
          cancelButtonIsClicked: false
        })
      } else {
        this.setState({
          cancelButtonIsClicked: !this.state.cancelButtonIsClicked
        })
      }
    } else if (constant !== 'FULL_LICENCE') {
      if (
        trainingPeriod < 5 &&
        !training_status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION' &&
        !training_status === 'TRAINING_WAITING_RIDER_CONFIRMATION'
      ) {
        this.setState({
          messageNoticePeriod: true,
          message:
            'ERROR! Unable to cancel course as it is within the cancellation notice period',
          cancelButtonIsClicked: false
        })
      } else if (
        trainingPeriod === 5 &&
        current_hour >= 17 &&
        !training_status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION' &&
        !training_status === 'TRAINING_WAITING_RIDER_CONFIRMATION'
      ) {
        this.setState({
          messageNoticePeriod: true,
          message:
            'ERROR! Unable to cancel course as it is within the cancellation notice period',
          cancelButtonIsClicked: false
        })
      } else {
        this.setState({
          cancelButtonIsClicked: !this.state.cancelButtonIsClicked
        })
      }
    }
  }

  async handleSubmit(rating) {
    const { order } = this.props
    const { training_location } = order
    await saveSupplierRating(training_location.id, rating)

    this.setState({
      reviewSubmitted: true
    })
  }

  componentDidMount() {
    const { order } = this.props
    const { training_status } = order
    if (
      training_status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION' ||
      training_status === 'TRAINING_WAITING_RIDER_CONFIRMATION'
    ) {
      this.setState({
        isOrderPending: true
      })
    }
    if (training_status === 'TRAINING_CANCELLED') {
      this.setState({
        isOrderCancelled: true
      })
    }
  }

  async handleCancelOrder(event) {
    const { order } = this.props
    const { onOrderUpdate } = this.props
    const { friendly_id } = order
    if (isAuthenticated()) {
      const user = getUserProfile(getToken())
      this.setState({
        cancelButtonIsClicked: !this.state.cancelButtonIsClicked
      })

      if (user) {
        try {
          const result = await cancelOrder(friendly_id)
          this.setState({
            messageCancelOrder: true,
            message: result.message,
            isOrderCancelled: true
          })
          onOrderUpdate(user.username)
        } catch (error) {
          const { response } = error
          this.setState({
            messageCancelOrder: true,
            message: response.data.message,
            isOrderCancelled: false
          })
        }
      }
    } else {
      window.alert('Please, login to cancel this order.')
    }
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
    const isFullLicence = order.trainings[0].constant === 'FULL_LICENCE'
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
            {order.trainings[0].training_date_time &&
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
            {renderTraining(order, this.state.isOrderCancelled)}
          </div>

          {showReview(order) && !reviewSubmitted && (
            <DashboardReview order={order} onSubmit={this.handleSubmit} />
          )}
          {this.state.isOrderCancelled && !this.state.cancelButtonIsClicked && (
            <div>
              <p>
                Your order has been cancelled and a refund will be processed
                shortly.
              </p>
            </div>
          )}
          <div>
            {!isFullLicence &&
              !this.state.isOrderCancelled &&
              !this.state.cancelButtonIsClicked && (
                <div className={styles.rowContainer}>
                  <div>
                    <RideToButton
                      alt
                      id="order-cancel-btn"
                      onClick={this.handleClick}
                      className={styles.cancelButton}>
                      Cancel Order
                    </RideToButton>
                  </div>
                  <div>
                    {this.state.messageNoticePeriod && (
                      <div className={styles.cancelButtonRow}>
                        <p className={styles.pMessage__notice}>
                          {this.state.message}
                        </p>
                      </div>
                    )}
                    {!this.state.messageNoticePeriod && (
                      <div className={styles.pMessage__changeDate}>
                        <p className={styles.pMessageChangeDate}>
                          To change the date or details of your training, please
                          email{' '}
                          <span className={styles.pEmail}>
                            hello@rideto.com
                          </span>{' '}
                          or visit our{' '}
                          <a
                            href="/contact#changeorcancelbooking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.HelpPage}>
                            Help Page
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            {!this.state.isOrderCancelled && this.state.cancelButtonIsClicked && (
              <div className={styles.rowContainer}>
                {this.state.isOrderPending && (
                  <p className={styles.pMessage}>
                    Are you sure you want to cancel your pending order?
                  </p>
                )}
                {!this.state.isOrderPending && (
                  <p className={styles.pMessage}>
                    Cancelling your order will result in a £20 admin fee,
                    deducted from your refund. Are you sure you want to cancel
                    your order?
                  </p>
                )}

                <div className={styles.rowContainer}>
                  <div className={styles.cancelButton__item}>
                    <RideToButton
                      alt
                      onClick={this.handleCancelOrder}
                      className={styles.cancelButton}>
                      Cancel Order
                    </RideToButton>
                  </div>
                  <div className={styles.keepButton__item}>
                    <RideToButton
                      alt
                      className={styles.keepButton}
                      onClick={() => {
                        this.setState({
                          cancelButtonIsClicked: !this.state
                            .cancelButtonIsClicked,
                          messageCancelOrder: false
                        })
                      }}>
                      Keep Order
                    </RideToButton>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!this.state.isOrderCancelled &&
            this.state.message &&
            !this.state.messageNoticePeriod &&
            !this.state.cancelButtonIsClicked && (
              <div>
                <p>{this.state.message}</p>
              </div>
            )}
        </div>

        <div className={styles.map}>
          <br />
          <MapComponent courses={[marker]} width="auto" height={240} />
        </div>
      </div>
    )
  }
}

export default OrderDetails
