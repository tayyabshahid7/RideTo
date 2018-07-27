import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SchoolSelect from 'components/SchoolSelect'
import { getSchoolOrders, changePage } from 'actions/orders'
import { changeSchool } from 'actions/authActions'
import ConfirmedOrders from '../components/ConfirmedOrders'
import PaginationLinks from 'components/PaginationLinks'
import styles from './styles.scss'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSorting = this.handleSorting.bind(this)

    this.state = {
      sorting: null
    }
  }

  componentDidMount() {
    this.props.getSchoolOrders(
      this.props.schoolId,
      this.props.page,
      this.state.sorting
    )
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

  render() {
    const { schoolId, user, changeSchool } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.ordersContainer}>
          <h1>Orders</h1>
          <SchoolSelect
            selected={schoolId}
            schools={user.suppliers}
            onChange={changeSchool}
          />
          {this.props.confirmedOrders &&
          this.props.confirmedOrders.results.length > 0 ? (
            <React.Fragment>
              <ConfirmedOrders
                loading={this.props.loading}
                confirmedOrders={this.props.confirmedOrders}
                sortingChange={this.handleSorting}
              />
              <PaginationLinks
                currentPage={this.props.page}
                count={this.props.confirmedOrders.count}
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
    confirmedOrders: state.orders.confirmedOrders,
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
