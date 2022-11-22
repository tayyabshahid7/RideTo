import moment from 'moment'
import React, { Component, Fragment } from 'react'
import FullLicenceAvailability from './FullLicenceAvailability'
import styles from './styles.scss'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES_OF_DAY = ['Morning', 'Afternoon']
const AVAILABILITY_TEXTS = {
  moderate: 'Moderate',
  good: 'Good'
}
function Zap(style) {
  return (
    <span
      style={{
        display: 'inline-block',
        color: 'var(--primary-color)',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'normal',
        verticalAlign: 'middle',
        ...style
      }}>
      <i className="fas fa-bolt" />
    </span>
  )
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
    let estimate = ''

    if (availability !== 'empty') {
      estimate = moment()
        .add(availability === 'moderate' ? 12 : 8, 'weeks')
        .format('dddd, Do MMMM')
    }

    return (
      <Fragment>
        {!isWidget && (
          <Fragment>
            <p className={styles.peakMessage}>
              <Zap /> = Peak times, reduced availability
            </p>
            <hr style={{ marginTop: '1.5rem' }} />
          </Fragment>
        )}
        <div id="choose-times">
          {TIMES_OF_DAY.map(time => (
            <Fragment key={time}>
              <div className={styles.timeOfDay}>{time}</div>
              <table className={styles.dayWeekTable}>
                <thead>
                  <tr>
                    {DAYS_OF_WEEK.map(day => (
                      <th key={day}>
                        {day.charAt(0)}{' '}
                        {['Sat', 'Sun'].includes(day) && !isWidget && <Zap />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
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
                </tbody>
              </table>
            </Fragment>
          ))}
        </div>
        {availability !== 'empty' && (
          <FullLicenceAvailability
            availability={AVAILABILITY_TEXTS[availability]}
            date={estimate}
          />
        )}
      </Fragment>
    )
  }
}

export default DayOfWeekPicker
