import React, {Component} from 'react'
import styles from './styles.scss'


class ConfirmedOrders extends Component {

  componentDidMount() {

  }

  checkCancelledOrRejected(order) {
    if(order.cancelled || order.booking_status !=='SCHOOL_CONFIRMED_BOOK') {
      return true
    }
    return false
  }

  render() {
    return (
      <div className={styles.container}>
      {
          <div>
            <table>
              <thead>
                <tr>
                   <th>Order #</th>
                   <th>Date Requested</th>
                   <th>Course</th>
                   <th>Bike Hire</th>
                   <th>Rider Name</th>
                   <th>Mobile #</th>
                   <th>STATUS</th>
                </tr>
              </thead>
              <tbody>

                {
                  this.props.confirmedOrders.results.map((order)=>
                    <tr key={order.friendly_id}>
                      <td>{order.friendly_id}</td>
                      <td>{this.checkCancelledOrRejected(order) ? order.user_date : order.start_time}</td>
                      <td>{order.selected_licence}</td>
                      <td>{order.bike_hire}</td>
                      <td>{this.checkCancelledOrRejected(order) ? '-': order.user_name}</td>
                      <td>{this.checkCancelledOrRejected(order) ? '-': order.user_phone}</td>
                      <td>{order.cancelled?'cancelled':(order.booking_status==='SCHOOL_CONFIRMED_BOOK'?'Confirmed':'Rejected')}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
      }
      </div>
    )
  }
}

export default ConfirmedOrders
