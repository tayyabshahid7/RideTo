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

  return (
    <div className={styles.bookingCompleteBanner}>
      <Container>
        <Row>
          <Col sm="1">
            <img src={Complete} alt="" />
          </Col>
          <Col sm="7" className={styles.heading}>
            <div className={styles.title}>Booking Complete</div>
            <div className={styles.subTitle}>{subTitle}</div>
          </Col>
          <Col sm="4">
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
