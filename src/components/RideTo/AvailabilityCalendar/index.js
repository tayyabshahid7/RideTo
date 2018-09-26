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
      courses,
      calendar,
      handleNextMonth,
      handlePrevMonth,
      handleDateSelect,
      handleTimeSelect,
      showDateTime,
      disablePreviousDates
    } = this.props
    return (
      <div className={classnames(styles.container)}>
        <CalendarHeader
          calendar={calendar}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          disablePreviousDates={disablePreviousDates}
        />
        {showDateTime && <div className={styles.subtitle}>Choose a date</div>}
        <CalendarContent
          days={days}
          calendar={calendar}
          handleDateSelect={handleDateSelect}
        />
        {showDateTime && <div className={styles.subtitle}>Choose a time</div>}
        {showDateTime &&
          calendar.selectedDate && (
            <CalendarTime
              calendar={calendar}
              courses={courses.filter(
                course => course.date === calendar.selectedDate
              )}
              handleTimeSelect={handleTimeSelect}
            />
          )}
      </div>
    )
  }
}

export default AvailabilityCalendar
