import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { capitalizeFirstLetter } from 'utils/helper'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES_OF_DAY = ['Morning', 'Afternoon', 'Evening']
const AVAILABILITY_TEXTS = {
  empty: 'Select all time slots you can do',
  moderate: 'Moderate availability',
  good: 'Good availability'
}

class DayOfWeekPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availability: 'empty'
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedTimeDays } = this.props
    let availability = 'empty'

    if (selectedTimeDays.length !== prevProps.selectedTimeDays.length) {
      if (selectedTimeDays.length > 0) {
        availability = 'moderate'
      }

      if (
        selectedTimeDays.filter(
          timeDay => !timeDay.includes('Sat_') && !timeDay.includes('Sun_')
        ).length > 3
      ) {
        availability = 'good'
      }

      this.setState({ availability })
    }
  }

  render() {
    const { isWidget, timeDayChange } = this.props
    const { availability } = this.state

    return (
      <Fragment>
        <div className={styles.availabilityWrapper}>
          <div
            className={classnames(
              styles.availabilityText,
              styles[`availabilityText${capitalizeFirstLetter(availability)}`]
            )}>
            {AVAILABILITY_TEXTS[availability]}
          </div>
        </div>
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
