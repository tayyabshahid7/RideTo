import React, {Component} from 'react'
import { withRouter} from 'react-router'
import { connect } from 'react-redux'
import styles from './styles.scss'
import {getPendingOrders} from 'scenes/Dashboard/actions'
import Notifications from 'scenes/Dashboard/components/Notifications'
import PaginationLinks from 'shared/PaginationLinks'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.handleChangePage = this.handleChangePage.bind(this)
    }

    componentDidMount() {
        this.props.getPendingOrders(this.props.schoolId, this.props.page)
    }

    handleChangePage(page) {
        this.props.getPendingOrders(this.props.schoolId, page)
    }

    render() {
        return (
            <div className={styles.container}>
             {
                this.props.pendingOrders && 
                this.props.pendingOrders.results.length > 0 ?
                    <div className={styles.main}>
                        <Notifications pendingOrders={this.props.pendingOrders} schoolName={this.props.schoolName}/>
                        <PaginationLinks
                          currentPage={this.props.page}
                          count={this.props.pendingOrders.count}
                          pageSize={this.props.pendingOrders.results.length}
                          rowName={'orders'}
                          onPageChange={this.handleChangePage}
                        />
                    </div>
                :
                    <div className={styles.noResults}>You're all update on orders</div>
            }
            </div>
        )
    }
}

export default withRouter(connect(
    state => ({
        schoolId: state.login.schoolId,
        schoolName: state.login.schoolName,
        pendingOrders: state.dashboard.pendingOrders,
        page: state.dashboard.page,
    }),
    dispatch => ({
        getPendingOrders: (schoolId, page) => dispatch(getPendingOrders(schoolId, page)),

    }),
)(Dashboard))

