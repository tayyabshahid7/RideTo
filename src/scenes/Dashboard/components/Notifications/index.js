import React, {Component} from 'react'
import styles from './styles.scss'
import {Link} from 'react-router-dom'


class Notifications extends Component {
    
    render() {
        return (
            <div className={styles.container}>

                <h1>Pending Orders</h1>
            {
                this.props.pendingOrders.length > 0 ?
                <table>
                    <thead>
                        <tr>
                           <th>Order #</th>
                           <th>Date Requested</th>
                           <th>Bike Type</th>
                           <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            this.props.pendingOrders.map((order)=>
                                <tr key={order.friendly_id}>
                                    <td>{order.friendly_id}</td>
                                    <td>{order.user_date}</td>
                                    <td>{order.bike_hire}</td>
                                    <td><Link className={styles.respondLink} to={`respond/${order.friendly_id}`}>Respond</Link></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                :
                <div className={styles.noResults}>There are no pending orders</div>
            }
            </div>
        )
    }
}

export default Notifications