import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { Col } from 'reactstrap'
import {
  getPendingOrders,
  getUnallocatedTests,
  hideUnallocatedTest
} from 'store/dashboard'
import { changeSchool } from 'store/auth'
import PendingOrdersTable from '../components/PendingOrdersTable'
import UnallocatedTestsTable from '../components/UnallocatedTestsTable'
import Loading from 'components/Loading'
import FaqsPanel from 'components/Home/FaqsPanel'
import styles from './styles.scss'
import commonStyles from '../../styles.scss'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sorting: null
    }
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSorting = this.handleSorting.bind(this)
    this.hideNotification = this.hideNotification.bind(this)
  }

  componentDidMount() {
    this.props.getPendingOrders(this.props.schoolId, this.props.page)
    this.props.getUnallocatedTests(this.props.schoolId)
  }

  handleChangePage(page) {
    this.props.getPendingOrders(this.props.schoolId, page)
  }

  handleSorting(sorting) {
    this.setState({ sorting: sorting }, () =>
      this.props.getPendingOrders(
        this.props.schoolId,
        this.props.page,
        this.state.sorting
      )
    )
  }

  hideNotification(id) {
    this.props.hideUnallocatedTest(this.props.schoolId, id)
  }

  render() {
    return (
      <div className={classnames(styles.container)}>
        <Col
          lg="8"
          className={classnames(styles.leftColumn, commonStyles.mainContent)}>
          <h2 className={styles.dashboardTitle}>Dashboard</h2>
          <Loading loading={this.props.loading}>
            {this.props.unallocatedTests && (
              <div>
                <h3 className={styles.dashboardSubTitle}>Unallocated Tests</h3>
                <UnallocatedTestsTable
                  tests={this.props.unallocatedTests.results}
                  hideNotification={this.hideNotification}
                />
              </div>
            )}
            <h3 className={styles.dashboardSubTitlePending}>Pending Orders</h3>
            {this.props.pendingOrders &&
            this.props.pendingOrders.results.length > 0 ? (
              <div className={styles.main}>
                <PendingOrdersTable
                  orders={this.props.pendingOrders.results}
                  sortingChange={this.handleSorting}
                />
              </div>
            ) : (
              <div className={styles.noResults}>No pending orders</div>
            )}
          </Loading>
        </Col>
        <Col className={styles.rightPanel}>
          <FaqsPanel />
        </Col>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName,
    pendingOrders: state.dashboard.pendingOrders,
    page: state.dashboard.page,
    loading: state.dashboard.loading,
    unallocatedTests: state.dashboard.unallocatedTests
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPendingOrders,
      getUnallocatedTests,
      changeSchool,
      hideUnallocatedTest
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
