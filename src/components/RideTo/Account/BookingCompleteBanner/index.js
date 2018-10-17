import React from 'react'
import moment from 'moment'
import { Container, Row, Col } from 'reactstrap'

import Button from 'components/RideTo/Button'
import Complete from 'assets/images/rideto/Complete.svg'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import styles from './BookingCompleteBanner.scss'
import { getCourseTitle } from 'services/course'

const BookingCompleteBanner = ({ order, onDetails }) => {
  const courseTitle = getCourseTitle(order.selected_licence)
  const date = moment(order.user_date, 'DD/MM/YYYY').format('dddd Do MMMM')
  const time = order.start_time ? `at ${order.start_time}` : ''
  const subTitle = `${courseTitle} on ${date} ${time}`
  const disclaimer = `You won't be charged until your booking is confirmed, we'll just reserve the ammount on your card. Booking require confirmation from the instructor, usually within 3 working hours.`
  const showDisclaimer = order.booking_status !== 'SCHOOL_CONFIRMED_BOOK'
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
