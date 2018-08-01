import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SchoolSelect from 'components/SchoolSelect'
import PaginationLinks from 'components/PaginationLinks'
import { fetchSchoolOrders, getDateFilters } from 'services/order'
import { changeSchool } from 'actions/authActions'

import ConfirmedOrders from '../components/ConfirmedOrders'
import OrderFilters from '../components/OrderFilters'
import styles from './styles.scss'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSorting = this.handleSorting.bind(this)
    this.handleDateFilter = this.handleDateFilter.bind(this)
    this.handleSearch = this.handleSearch.bind(this)

    this.state = {
      loading: false,
      page: 1,
      ordering: null,
      search: null,
      dateFilter: getDateFilters()[0],
      confirmedOrders: {
        results: []
      }
    }
  }

  async componentDidMount() {
    this.fetchOrders()
  }

  async componentDidUpdate(oldProps) {
    if (oldProps.schoolId !== this.props.schoolId) {
      this.fetchOrders()
    }
  }

  async fetchOrders() {
    const { schoolId } = this.props
    const { dateFilter, search, ordering, page } = this.state
    const sdate = dateFilter.getStartDate()
    const edate = dateFilter.getEndDate()
    const params = { sdate, edate, search, page, ordering }
    const orders = await fetchSchoolOrders(schoolId, params)

    this.setState({
      confirmedOrders: orders,
      loading: false
    })
  }

  handleChangePage(page) {
    this.setState({ page, loading: true }, () => this.fetchOrders())
  }

  handleSorting(ordering) {
    this.setState({ ordering, loading: true }, () => this.fetchOrders())
  }

  handleDateFilter(dateFilter) {
    this.setState({ dateFilter, loading: true }, () => {
      this.fetchOrders()
    })
  }

  handleSearch(search) {
    this.setState({ search, loading: true }, () => {
      this.fetchOrders()
    })
  }

  render() {
    const { schoolId, user, changeSchool } = this.props
    const { confirmedOrders, dateFilter, page, loading } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.ordersContainer}>
          <h1>Orders</h1>
          <SchoolSelect
            selected={schoolId}
            schools={user.suppliers}
            onChange={changeSchool}
          />
          <OrderFilters
            filters={getDateFilters()}
            selectedFilter={dateFilter}
            onDateFilter={this.handleDateFilter}
            onSearch={this.handleSearch}
          />
          {confirmedOrders.results.length > 0 ? (
            <React.Fragment>
              <ConfirmedOrders
                loading={this.props.loading}
                confirmedOrders={confirmedOrders}
                sortingChange={this.handleSorting}
              />
              <PaginationLinks
                currentPage={page}
                count={confirmedOrders.count}
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
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName,
    page: state.orders.page
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
