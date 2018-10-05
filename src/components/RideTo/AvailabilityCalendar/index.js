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
      showTime,
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
        <CalendarContent
          days={days}
          calendar={calendar}
          handleDateSelect={handleDateSelect}
        />
        {showTime && <div className={styles.subtitle}>Choose a time</div>}
        {showTime &&
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
