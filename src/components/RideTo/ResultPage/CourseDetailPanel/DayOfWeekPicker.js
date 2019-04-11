import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES_OF_DAY = ['Morning', 'Afternoon', 'Evening']

class DayOfWeekPicker extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { isWidget, timeDayChange } = this.props

    return (
      <Fragment>
        <p
          className={classnames(
            styles.dasInfo,
            isWidget && styles.dasInfoWidget,
            styles.dasInfoCenter
          )}>
          Top instructors have busy schedules, so select{' '}
          <strong>as many slots as possible</strong> to ensure you get the best
          match and choice of lesson times.
        </p>
        <table className={styles.dayWeekTable}>
          <thead>
            <tr>
              <th />
              {DAYS_OF_WEEK.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES_OF_DAY.map(time => (
              <tr key={time}>
                <td>{time}</td>
                {DAYS_OF_WEEK.map(day => (
                  <td key={day}>
                    <input
                      type="checkbox"
                      onChange={event => {
                        const { checked } = event.target
                        timeDayChange({ time, day, status: checked })
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    )
  }
}

export default DayOfWeekPicker
