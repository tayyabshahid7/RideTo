import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { Col, Row } from 'reactstrap'
import { getPendingOrders } from 'store/dashboard'
import { changeSchool } from 'store/auth'
// import Notifications from '../components/Notifications'
import PendinOrdersTable from '../components/PendingOrdersTable'
import PaginationLinks from 'components/PaginationLinks'
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
        <Loading loading={this.props.loading}>
          <Row>
            <Col
              lg="8"
              className={classnames(
                styles.leftColumn,
                commonStyles.mainContent
              )}>
              <h2>Pending Orders</h2>
              {this.props.pendingOrders &&
              this.props.pendingOrders.results.length > 0 ? (
                <div className={styles.main}>
                  <PendinOrdersTable
                    orders={this.props.pendingOrders.results}
                    sortingChange={this.handleSorting}
                  />
                  <PaginationLinks
                    currentPage={this.props.page}
                    count={this.props.pendingOrders.count}
                    pageSize={20}
                    rowName={'orders'}
                    onPageChange={this.handleChangePage}
                  />
                </div>
              ) : (
                <div className={styles.noResults}>
                  ʘ‿ʘ Everything up to date!
                </div>
              )}
            </Col>
            <Col lg="4" className={styles.rightPanel}>
              <FaqsPanel />
            </Col>
          </Row>
        </Loading>
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
    loading: state.dashboard.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getPendingOrders,
      changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)
