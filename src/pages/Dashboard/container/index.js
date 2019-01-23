import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { Col, Row } from 'reactstrap'
import { getPendingOrders, getUnallocatedTests } from 'store/dashboard'
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

  render() {
    return (
      <div className={classnames(styles.container)}>
        <Row style={{ height: '100%' }}>
          <Col
            lg="8"
            className={classnames(styles.leftColumn, commonStyles.mainContent)}>
            <Loading loading={this.props.loading}>
              {this.props.unallocatedTests && (
                <div>
                  <h2>Unallocated Tests</h2>
                  <UnallocatedTestsTable
                    tests={this.props.unallocatedTests.results}
                  />
                </div>
              )}
              <h2>Pending Orders</h2>
              {this.props.pendingOrders &&
              this.props.pendingOrders.results.length > 0 ? (
                <div className={styles.main}>
                  <PendingOrdersTable
                    orders={this.props.pendingOrders.results}
                    sortingChange={this.handleSorting}
                  />
                </div>
              ) : (
                <div className={styles.noResults}>
                  ʘ‿ʘ Everything up to date!
                </div>
              )}
            </Loading>
          </Col>
          <Col lg="4" className={styles.rightPanel}>
            <FaqsPanel />
          </Col>
        </Row>
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
      changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
