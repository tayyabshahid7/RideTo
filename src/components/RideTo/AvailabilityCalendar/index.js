import React, { Component } from 'react'
import classnames from 'classnames'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import CalendarContent from './CalendarContent'
import CalendarTime from './CalendarTime'

class AvailabilityCalendar extends Component {
  render() {
    let {
      days,
      calendar,
      handleNextMonth,
      handlePrevMonth,
      handleDateSelect,
      handleTimeSelect
    } = this.props
    return (
      <div className={classnames(styles.container)}>
        <CalendarHeader
          calendar={calendar}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
        />
        <div className={styles.subtitle}>Choose a date</div>
        <CalendarContent
          days={days}
          calendar={calendar}
          handleDateSelect={handleDateSelect}
        />
        <div className={styles.subtitle}>Choose a time</div>
        <CalendarTime
          calendar={calendar}
          times={['07:00', '11:00']}
          handleTimeSelect={handleTimeSelect}
        />
      </div>
    )
  }
}

export default AvailabilityCalendar
