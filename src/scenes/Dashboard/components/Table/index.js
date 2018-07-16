import React, { Component } from 'react';
import { connect } from 'react-redux'
import styles from './styles.scss'

class Table extends Component {
  render() {
    return (
      <div className={styles.container}>
        <table>
          <thead>
            <tr>
               <th>Order #</th>
               <th>Date Requested</th>
               <th>Bike Type</th>
               <th>School location</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.orders.map((order)=>
                <tr key={order.friendly_id}>
                  <td>{order.friendly_id}</td>
                  <td>{order.user_date}</td>
                  <td>{order.bike_hire}</td>
                  <td>{order.location}</td>
                  <td><a className={styles.respondLink} href={`${order.school_confirm_url}`} target="_blank">Respond</a></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}


export default connect()(Table)