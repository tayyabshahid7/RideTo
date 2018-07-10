import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import styles from './styles.scss'
import Notifications from './components/Notifications'
import getPendingOrders from './actions'

const pendingOrders = [
    {friendly_id: '1234', user_date:'01/01/2018',bike_hire:'Auto'},
    {friendly_id: '1235', user_date:'02/01/2018',bike_hire:'Manual'},
    {friendly_id: '1236', user_date:'03/01/2018',bike_hire:'Manual'},
    {friendly_id: '1237', user_date:'04/01/2018',bike_hire:'Manual'},
    {friendly_id: '1238', user_date:'05/01/2018',bike_hire:'Auto'},
    {friendly_id: '1239', user_date:'06/01/2018',bike_hire:'Manual'},
    {friendly_id: '1240', user_date:'07/01/2018',bike_hire:'Auto'},
    {friendly_id: '1241', user_date:'08/01/2018',bike_hire:'Auto'},
]

class Dashboard extends Component {
    render() {
        return (
            <div className={styles.container}>
                <Notifications pendingOrders={pendingOrders}/>
            </div>
        )
    }
}

export default withRouter(connect(
    state => ({
        user: state.loginReducer.session.user,
    }),
    dispatch => ({
        getPendingOrders: (userEmail, schoolId) => dispatch(getPendingOrders(userEmail, schoolId, sessionStorage.getItem('token'))),

    })
)(Dashboard))
