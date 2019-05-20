import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import SchoolSelect from 'components/SchoolSelect'
import PaginationLinks from 'components/PaginationLinks'
import { getDateFilters } from 'services/order'
import { changeSchool } from 'store/auth'
import * as orderModule from 'store/order'
import Loading from 'components/Loading'

import ConfirmedOrders from 'pages/Orders/components/ConfirmedOrders'
import OrderFilters from 'pages/Orders/components/OrderFilters'
import styles from './styles.scss'
import commonStyles from '../../styles.scss'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSorting = this.handleSorting.bind(this)
    this.handleDateFilter = this.handleDateFilter.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      page: 1,
      ordering: null,
      search: null,
      dateFilter: getDateFilters()[3]
    }
  }

  componentDidUpdate(oldProps) {
    if (oldProps.supplierId !== this.props.supplierId) {
      this.fetchOrders()
    }
  }

  componentDidMount() {
    this.fetchOrders()
  }

  fetchOrders() {
    const { supplierId } = this.props
    const { dateFilter, search, ordering, page } = this.state
    const sdate = dateFilter.getStartDate()
    const edate = dateFilter.getEndDate()
    const params = { sdate, edate, search, page, ordering }

    this.props.fetchSupplierOrders(supplierId, params)
  }

  handleChangePage(page) {
    this.setState({ page }, () => this.fetchOrders())
  }

  handleSorting(ordering) {
    this.setState({ ordering }, () => this.fetchOrders())
  }

  handleDateFilter(dateFilter) {
    this.setState({ dateFilter }, () => {
      this.fetchOrders()
    })
  }

  handleSearch(search) {
    this.setState({ search }, () => {
      this.fetchOrders()
    })
  }

  render() {
    const {
      orders,
      total,
      supplierId,
      user,
      changeSchool,
      isFetching
    } = this.props
    const { dateFilter, page } = this.state

    return (
      <div className={styles.container}>
        <div
          className={classnames(
            styles.ordersContainer,
            commonStyles.mainContent
          )}>
          <h1>Orders</h1>
          <div style={{ maxWidth: '400px' }}>
            <SchoolSelect
              selected={supplierId}
              schools={user.suppliers}
              onChange={changeSchool}
            />
          </div>
          <div className={styles.orderFilters}>
            <div className={styles.sortByTraining}>Sort by training date</div>
            <OrderFilters
              filters={getDateFilters()}
              selectedFilter={dateFilter}
              onDateFilter={this.handleDateFilter}
              onSearch={this.handleSearch}
            />
          </div>
          <Loading loading={isFetching}>
            {orders.length > 0 ? (
              <React.Fragment>
                <ConfirmedOrders
                  loading={isFetching}
                  confirmedOrders={orders}
                  sortingChange={this.handleSorting}
                />
                <PaginationLinks
                  currentPage={page}
                  count={total}
                  pageSize={15}
                  rowName={'orders'}
                  onPageChange={this.handleChangePage}
                />
              </React.Fragment>
            ) : (
              <div className={styles.noResults}>
                No orders yet. No worries we have your back! ;)
              </div>
            )}
          </Loading>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const supplierId = parseInt(state.auth.schoolId, 10)
  const { total, isFetching } = state.order

  return {
    supplierId,
    total,
    isFetching,
    user: state.auth.user,
    schoolName: state.auth.schoolName,
    orders: orderModule.selectors.getItems(state.order)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool,
      ...orderModule.actions
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
