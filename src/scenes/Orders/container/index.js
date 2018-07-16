import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getSchoolOrders, changePage} from 'scenes/Orders/actions'
import ConfirmedOrders from 'scenes/Orders/components/ConfirmedOrders'
import PaginationLinks from 'shared/PaginationLinks'
import styles from './styles.scss'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schoolId: props.schoolId,
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentDidMount() {
    this.props.getSchoolOrders(this.state.schoolId, this.props.page)
  }

  handleChangePage(page) {
    this.props.getSchoolOrders(this.state.schoolId, page) 
  }

  render() {
    return (
      <div className={styles.container}>

      { this.props.confirmedOrders &&
        this.props.confirmedOrders.results.length > 0 ?
          <div>
            <ConfirmedOrders confirmedOrders={this.props.confirmedOrders}/>
            <PaginationLinks 
              currentPage={this.props.page}
              count={this.props.confirmedOrders.count}
              pageSize={this.props.confirmedOrders.results.length}
              rowName={'orders'}
              onPageChange={this.handleChangePage}
            />
          </div>
        :
          <div className={styles.noResults}>No orders yet. No worries we have your back! ;)</div>
      }
      </div>
    )
  }
}


export default withRouter(connect(
  state => ({
    schoolId: state.login.schoolId,
    confirmedOrders: state.orders.confirmedOrders,
    page: state.orders.page,
  }),
  dispatch => ({
    getSchoolOrders: (page, schoolId) => dispatch(getSchoolOrders(page, schoolId)),
    changePage: (page) => dispatch(changePage(page))
  })
)(Orders))