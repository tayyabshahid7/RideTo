import React from 'react'
import moment from 'moment'
import MapComponent from 'components/RideTo/MapComponent'
import { getCourseTitle } from 'services/course'

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
  render() {
    const { order } = this.props
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
            {renderRow('Status', order.status)}
          </div>
        </div>

        <div className={styles.map}>
          <MapComponent courses={[marker]} />
        </div>
      </div>
    )
  }
}

export default OrderDetails
