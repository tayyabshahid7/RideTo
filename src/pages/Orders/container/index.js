import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SchoolSelect from 'components/SchoolSelect'
import { getSchoolOrders, changePage } from '../../../actions/orders'
import { changeSchool } from '../../../actions/authActions'
import ConfirmedOrders from '../components/ConfirmedOrders'
import PaginationLinks from '../../../components/PaginationLinks'
import styles from './styles.scss'
import classnames from 'classnames'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentDidMount() {
    this.props.getSchoolOrders(this.props.schoolId, this.props.page)
  }

  handleChangePage(page) {
    this.props.getSchoolOrders(this.props.schoolId, page)
  }

  render() {
    const { schoolId, user, changeSchool } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.ordersContainer}>
          <h2>
            Orders -
            <SchoolSelect
              selected={schoolId}
              schools={user.suppliers}
              onChange={changeSchool}
            />
          </h2>
          {this.props.confirmedOrders &&
          this.props.confirmedOrders.results.length > 0 ? (
            <React.Fragment>
              <ConfirmedOrders
                loading={this.props.loading}
                confirmedOrders={this.props.confirmedOrders}
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
