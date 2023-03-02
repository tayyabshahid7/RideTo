import moment from 'moment'
import React from 'react'
import { Col, Container, Row } from 'reactstrap'

import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import Complete from 'assets/images/rideto/Complete.svg'
import Button from 'components/RideTo/Button'
import styles from './BookingCompleteBanner.scss'

const BookingCompleteBanner = ({ order, onDetails }) => {
  const course_title = order.course_title || order.trainings[0].course_type
  const isFullLicence = course_title && course_title.includes('Full Licence')
  const training = order.trainings[0]
  const date = moment(training.requested_date, 'YYYY-MM-DD').format(
    'dddd Do MMMM'
  )
  const startTime = moment(training.training_date_time)
  const time =
    training.training_date_time && order.source === 'RIDETO_INSTANT'
      ? `at ${startTime.format('hh:mm A')}`
      : ''
  // const selectedPackage = `${order.trainings.length} day package`
  const subTitle = isFullLicence
    ? `${course_title}`
    : `${course_title} on ${date} ${time}`
  const disclaimer = `You won't be charged until your booking is confirmed, we'll just reserve the amount on your card. Bookings require confirmation from the instructor, usually within ${
    isFullLicence ? '24' : '3'
  } working hours.`
  const fullLicenceDisclaimer =
    "You won't be charged until your booking is confirmed, we'll just reserve the amount on your card. Bookings require confirmation from the instructor."
  const showDisclaimer = order.source !== 'RIDETO_INSTANT'
  return (
    <div className={styles.bookingCompleteBanner}>
      <Container>
        <Row>
          <Col sm="1">
            <img className={styles.completeImage} src={Complete} alt="" />
          </Col>
          <Col sm="7" className={styles.heading}>
            <div className={styles.title}>Booking Complete</div>
            <div className={styles.subTitle}>
              {subTitle}
              {showDisclaimer && !isFullLicence && (
                <span>
                  <br />
                  <br />
                  {disclaimer}
                </span>
              )}
              {isFullLicence && (
                <span>
                  <br />
                  <br />
                  {fullLicenceDisclaimer}
                </span>
              )}
            </div>
          </Col>
          <Col sm="4" className={styles.detailsButton}>
            <Button onClick={() => onDetails(order)} className={styles.viewBtn}>
              <span>View Booking Details</span>
              <img src={ArrowRight} alt="" />
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default BookingCompleteBanner
