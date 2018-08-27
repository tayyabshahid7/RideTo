import React, { Component } from 'react'
import Loading from 'components/Loading'

import styles from './styles.scss'
import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'

class ConfirmedOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friendly_id: null,
      start_time: null,
      bike_hire: null,
      user_name: null,
      user_phone: null,
      booking_status: null
    }
    this.handleSort = this.handleSort.bind(this)
  }

  _checkCancelledOrRejected(order) {
    if (order.cancelled || order.booking_status !== 'SCHOOL_CONFIRMED_BOOK') {
      return true
    }
    return false
  }

  _getSortingData() {
    const sortingData = Object.keys(this.state)
      .filter(c => this.state[c] !== null)
      .map(column => {
        if (this.state[column] !== null) {
          return this.state[column]
        }
        return undefined
      })
    return sortingData.toString()
  }

  handleSort(column, ordering, shiftPressed) {
    const newState = shiftPressed
      ? {}
      : {
          friendly_id: null,
          start_time: null,
          bike_hire: null,
          user_name: null,
          user_phone: null,
          booking_status: null,
          selected_licence: null
        }

    this.setState({ ...newState, [column]: ordering }, () => {
      const sorting = this._getSortingData()
      this.props.sortingChange(sorting)
    })
  }

  render() {
    const { friendly_id, start_time, user_name, selected_licence } = this.state

    return (
      <div className={styles.container}>
        {
          <div>
            <Loading loading={this.props.loading}>
              <table className={commonStyles.dataTable}>
                <thead>
                  <tr>
                    <Header
                      column="friendly_id"
                      ordering={friendly_id || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort('friendly_id', ordering, shiftPressed)
                      }}>
                      Order #
                    </Header>
                    <Header
                      column="start_time"
                      ordering={start_time || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort('start_time', ordering, shiftPressed)
                      }}>
                      Training Date
                    </Header>
                    <Header
                      column="selected_licence"
                      ordering={selected_licence || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort(
                          'selected_licence',
                          ordering,
                          shiftPressed
                        )
                      }}>
                      Course
                    </Header>
                    <th>Bike Hire</th>
                    <Header
                      column="user_name"
                      ordering={user_name || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort('user_name', ordering, shiftPressed)
                      }}>
                      Rider Name
                    </Header>
                    <th>Mobile #</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.confirmedOrders.results.map(order => (
                    <tr key={order.friendly_id}>
                      <td>{order.friendly_id}</td>
                      <td>
                        {this._checkCancelledOrRejected(order)
                          ? order.user_date
                          : order.start_time}
                      </td>
                      <td>
                        {order.selected_licence === 'LICENCE_CBT'
                          ? 'CBT Training '
                          : 'CBT Renewal'}
                      </td>
                      <td>
                        {order.bike_hire === 'auto'
                          ? 'Automatic'
                          : order.bike_hire === 'manual'
                            ? 'Manual'
                            : 'None'}
                      </td>
                      <td>
                        {this._checkCancelledOrRejected(order)
                          ? '-'
                          : order.user_name}
                      </td>
                      <td>
                        {this._checkCancelledOrRejected(order)
                          ? '-'
                          : order.user_phone}
                      </td>
                      <td>
                        {order.cancelled
                          ? 'Cancelled'
                          : order.booking_status === 'SCHOOL_CONFIRMED_BOOK'
                            ? 'Confirmed'
                            : 'Rejected'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Loading>
          </div>
        }
      </div>
    )
  }
}

export default ConfirmedOrders
