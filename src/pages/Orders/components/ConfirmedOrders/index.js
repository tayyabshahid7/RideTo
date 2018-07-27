import React, { Component } from 'react'
import Loading from 'components/Loading'
import styles from './styles.scss'

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

  handleSort(e) {
    if (e.target) {
      const column = e.target.getAttribute('name')
      const shiftPressed = e.shiftKey

      this.setState(
        prevState => {
          let newState = {}
          if (!shiftPressed) {
            newState = {
              friendly_id: null,
              start_time: null,
              bike_hire: null,
              user_name: null,
              user_phone: null,
              booking_status: null,
              selected_licence: null
            }
          }

          if (
            prevState[column] === null ||
            prevState[column] === `-${column}`
          ) {
            newState[column] = column
          } else {
            newState[column] = '-' + column
          }
          return newState
        },
        () => {
          const sorting = this._getSortingData()
          this.props.sortingChange(sorting)
        }
      )
    }
  }

  render() {
    const {
      friendly_id,
      start_time,
      bike_hire,
      user_name,
      user_phone,
      booking_status,
      selected_licence
    } = this.state

    return (
      <div className={styles.container}>
        {
          <div>
            <Loading loading={this.props.loading}>
              <table>
                <thead>
                  <tr>
                    <th
                      className={
                        friendly_id &&
                        (friendly_id.startsWith('-') ? styles.asc : styles.desc)
                      }
                      name="friendly_id"
                      onClick={e => this.handleSort(e)}>
                      Order #
                    </th>
                    <th
                      className={
                        start_time &&
                        (start_time.startsWith('-') ? styles.asc : styles.desc)
                      }
                      name="start_time"
                      onClick={e => this.handleSort(e)}>
                      Training Date
                    </th>
                    <th
                      className={
                        selected_licence &&
                        (selected_licence.startsWith('-')
                          ? styles.asc
                          : styles.desc)
                      }
                      name="selected_licence"
                      onClick={e => this.handleSort(e)}>
                      Course
                    </th>
                    <th>Bike Hire</th>
                    <th
                      className={
                        user_name &&
                        (user_name.startsWith('-') ? styles.asc : styles.desc)
                      }
                      name="user_name"
                      onClick={e => this.handleSort(e)}>
                      Rider Name
                    </th>
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
