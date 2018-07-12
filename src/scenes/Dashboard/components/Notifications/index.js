import React, {Component} from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import { Link, withRouter, Route} from 'react-router-dom'
import Modal from 'shared/Modal'

class Notifications extends Component {
    
    render() {
        return (
            <div className={styles.container}>

                <h1>NOTIFICACIONS</h1>
                <h2>Pending Orders</h2>
                <hr/>
                {
                    this.props.pendingOrders &&
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
                                        <td><Link className={styles.respondLink} to={`/dashboard/respond/${order.friendly_id}`}>Respond</Link></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    :
                    <div className={styles.noResults}>You're all update on orders</div>
                }
                <Route path="/dashboard/respond/:id" component={Modal}/>
                <hr/>
            </div>
        )
    }
}

export default withRouter(connect()(Notifications))