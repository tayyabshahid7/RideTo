import React, { Component } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import Loading from 'components/Loading'

import styles from './styles.scss'
import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
import Cell from 'components/DataTable/Cell'
import { getCourseTitle } from 'services/course'

const getDate = startTime => {
  if (startTime) {
    return moment(new Date(startTime)).format('YYYY-MM-DD')
  }
}

class ConfirmedOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friendly_id: null,
      training_date_time: null,
      first_name: null,
      selected_licence: null
    }
    this.handleSort = this.handleSort.bind(this)
  }

  _checkCancelledOrRejected(status) {
    if (
      status === 'TRAINING_CANCELLED' ||
      status === 'TRAINING_WAITING_RIDER_CONFIRMATION'
    ) {
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

  _getTrainingStatus(status) {
    if (status === 'TRAINING_CANCELLED') {
      return 'Cancelled'
    } else if (status === 'TRAINING_CONFIRMED') {
      return 'Confirmed'
    } else if (status === 'TRAINING_FAILED') {
      return 'Not passed'
    } else if (status === 'TRAINING_WAITING_SCHOOL_CONFIRMATION') {
      return 'Pending'
    } else if (status === 'TRAINING_WAITING_RIDER_CONFIRMATION') {
      return 'Waiting for rider'
    } else if (status === 'TRAINING_NO_SHOW') {
      return 'No show'
    } else if (status === 'TRAINING_PASSED') {
      return 'CBT Passed'
    } else {
      return 'N/A'
    }
  }

  handleSort(column, ordering, shiftPressed) {
    const newState = shiftPressed
      ? {}
      : {
          order__friendly_id: null,
          training_date_time: null,
          order__customer__first_name: null,
          course_type__constant: null
        }

    this.setState({ ...newState, [column]: ordering }, () => {
      const sorting = this._getSortingData()
      this.props.sortingChange(sorting)
    })
  }

  render() {
    const {
      order__friendly_id: friendly_id,
      order__customer__first_name: first_name,
      course_type__constant: selected_licence,
      training_date_time
    } = this.state

    return (
      <div className={styles.container}>
        {
          <div>
            <Loading loading={this.props.loading}>
              <table
                className={classnames(
                  commonStyles.dataTable,
                  'table table-responsive-md'
                )}>
                <thead>
                  <tr>
                    <Header
                      column="order__friendly_id"
                      ordering={friendly_id || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort(
                          'order__friendly_id',
                          ordering,
                          shiftPressed
                        )
                      }}>
                      Order #
                    </Header>
                    <Header
                      column="training_date_time"
                      ordering={training_date_time || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort(
                          'training_date_time',
                          ordering,
                          shiftPressed
                        )
                      }}>
                      Training Date
                    </Header>
                    <Header
                      column="course_type__constant"
                      ordering={selected_licence || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort(
                          'course_type__constant',
                          ordering,
                          shiftPressed
                        )
                      }}>
                      Course
                    </Header>
                    <Header>Bike Hire</Header>
                    <Header
                      column="order__customer__first_name"
                      ordering={first_name || ''}
                      onSort={(ordering, shiftPressed) => {
                        this.handleSort(
                          'order__customer__first_name',
                          ordering,
                          shiftPressed
                        )
                      }}>
                      Rider Name
                    </Header>
                    <Header>Mobile #</Header>
                    <Header>Status</Header>
                  </tr>
                </thead>
                <tbody>
                  {this.props.confirmedOrders.map(training => (
                    <tr key={training.id}>
                      <Cell>{training.order.direct_friendly_id}</Cell>
                      <Cell>
                        {this._checkCancelledOrRejected(training.status)
                          ? getDate(training.requested_date)
                          : moment(training.requested_date).format('D MMM YY')}
                      </Cell>
                      <Cell>{getCourseTitle(training.course_type)}</Cell>
                      <Cell>
                        {['BIKE_TYPE_AUTO', 'auto', 'AUTO'].includes(
                          training.bike_type
                        )
                          ? 'Automatic'
                          : ['BIKE_TYPE_MANUAL', 'manual', 'MANUAL'].includes(
                              training.bike_type
                            )
                          ? 'Manual'
                          : 'None'}
                      </Cell>
                      <Cell>
                        {this._checkCancelledOrRejected(training.status)
                          ? '-'
                          : training.customer.full_name}
                      </Cell>
                      <Cell>
                        {this._checkCancelledOrRejected(training.status)
                          ? '-'
                          : training.customer.phone}
                      </Cell>
                      <Cell>{this._getTrainingStatus(training.status)}</Cell>
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
