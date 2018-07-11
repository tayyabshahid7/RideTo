import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import styles from './styles.scss'
import Notifications from 'scenes/Dashboard/components/Notifications'
import {getPendingOrders} from 'scenes/Dashboard/actions'

class Dashboard extends Component {
    componentDidMount() {
        this.props.getPendingOrders('803')
    }
    render() {
        return (
            <div className={styles.container}>
                <Notifications pendingOrders={this.props.pendingOrders}/>
            </div>
        )
    }
}

export default withRouter(connect(
    state => ({
        user: state.loginReducer.session.user,
        pendingOrders: state.dashboardReducer.pendingOrders,
    }),
    dispatch => ({
        getPendingOrders: schoolId => dispatch(getPendingOrders(schoolId, sessionStorage.getItem('token'))),

    }),
)(Dashboard))

