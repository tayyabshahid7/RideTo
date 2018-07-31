import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SchoolSelect from 'components/SchoolSelect'
import PaginationLinks from 'components/PaginationLinks'
import { getSchoolOrders, changePage } from 'actions/orders'
import { fetchSchoolOrders } from 'services/order'
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

    this.state = {
      sorting: null,
      sdate: null,
      edate: null,
      confirmedOrders: {
        results: []
      }
    }
  }

  async componentDidMount() {
    const { schoolId, page, sorting } = this.props
    this.fetchOrders()
  }

  async fetchOrders() {
    const { schoolId, page, sorting } = this.props
    const { sdate, edate } = this.state
    const params = { sdate, edate, page, sorting }
    const orders = await fetchSchoolOrders(schoolId, params)

    this.setState({
      confirmedOrders: orders
    })
  }

  handleChangePage(page) {
    this.props.getSchoolOrders(this.props.schoolId, page, this.state.sorting)
  }

  handleSorting(sorting) {
    this.setState({ sorting: sorting }, () =>
      this.props.getSchoolOrders(
        this.props.schoolId,
        this.props.page,
        this.state.sorting
      )
    )
  }

  handleDateFilter(sdate) {
    this.setState({ sdate }, () => {
      this.fetchOrders()
    })
  }

  render() {
    const { schoolId, user, changeSchool } = this.props
    const { confirmedOrders } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.ordersContainer}>
          <h1>Orders</h1>
          <SchoolSelect
            selected={schoolId}
            schools={user.suppliers}
            onChange={changeSchool}
          />
          <OrderFilters onDateFilter={this.handleDateFilter} />
          {confirmedOrders.results.length > 0 ? (
            <React.Fragment>
              <ConfirmedOrders
                loading={this.props.loading}
                confirmedOrders={confirmedOrders}
                sortingChange={this.handleSorting}
              />
              <PaginationLinks
                currentPage={this.props.page}
                count={confirmedOrders.count}
                pageSize={20}
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
    page: state.orders.page,
    loading: state.orders.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchoolOrders,
      changePage,
      changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
