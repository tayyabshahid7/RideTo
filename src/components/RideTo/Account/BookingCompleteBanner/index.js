import React from 'react'
import moment from 'moment'
import { Container, Row, Col } from 'reactstrap'

import Button from 'components/RideTo/Button'
import Complete from 'assets/images/rideto/Complete.svg'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import styles from './BookingCompleteBanner.scss'

const BookingCompleteBanner = ({ order, onDetails }) => {
  const training = order.trainings[0]
  const date = moment(training.requested_date, 'YYYY-MM-DD').format(
    'dddd Do MMMM'
  )
  const startTime = moment(training.training_date_time)
  const time =
    training.training_date_time && order.source === 'RIDETO_INSTANT'
      ? `at ${startTime.format('hh:mm A')}`
      : ''
  const selectedPackage = `${order.trainings.length} day package`
  const subTitle = order.course_title.includes('Full Licence')
    ? `${order.course_title} - ${selectedPackage} starting on ${date} ${time}`
    : `${order.course_title} on ${date} ${time}`
  const disclaimer = `You won't be charged until your booking is confirmed, we'll just reserve the ammount on your card. Booking require confirmation from the instructor, usually within 3 working hours.`
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
              {showDisclaimer && (
                <span>
                  <br />
                  <br />
                  {disclaimer}
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
