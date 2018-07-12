import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getSchoolOrders} from 'scenes/Orders/actions'
import ConfirmedOrders from 'scenes/Orders/components/ConfirmedOrders'
import styles from './styles.scss'

class Orders extends Component {
  componentDidMount() {
    this.props.getSchoolOrders('803')
  }

  render() {
    return (
      <div className={styles.container}>
        <ConfirmedOrders confirmedOrders={this.props.confirmedOrders}/>
      </div>
    )
  }
}


export default withRouter(connect(
  state => ({
    confirmedOrders: state.orders.confirmedOrders,
  }),
  dispatch => ({
    getSchoolOrders: (schoolId) => dispatch(getSchoolOrders(schoolId))
  })
)(Orders))