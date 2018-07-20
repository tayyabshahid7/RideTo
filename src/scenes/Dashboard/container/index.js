import React, {Component} from 'react'
import { withRouter} from 'react-router'
import { connect } from 'react-redux'
import styles from './styles.scss'
import {getPendingOrders} from 'scenes/Dashboard/actions'
import Notifications from 'scenes/Dashboard/components/Notifications'
import PaginationLinks from 'shared/PaginationLinks'
import PendingOrdersTable from 'scenes/Dashboard/components/PendingOrdersTable'
import Loading from 'shared/Loading'
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
                <Notifications schoolName={this.props.schoolName}/>
                <Loading loading={this.props.loading}>
                    {
                    this.props.pendingOrders && 
                    this.props.pendingOrders.results.length > 0 ?
                        <div className={styles.main}>
                            <PendingOrdersTable orders={this.props.pendingOrders.results}/>
                            <PaginationLinks
                              currentPage={this.props.page}
                              count={this.props.pendingOrders.count}
                              pageSize={15}
                              rowName={'orders'}
                              onPageChange={this.handleChangePage}
                            />
                        </div>
                    :
                        <div className={styles.noResults}>ʘ‿ʘ Everything up to date!</div>
                    }
                    
                </Loading>
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
        loading: state.dashboard.loading,
    }),
    dispatch => ({
        getPendingOrders: (schoolId, page) => dispatch(getPendingOrders(schoolId, page)),

    }),
)(Dashboard))

