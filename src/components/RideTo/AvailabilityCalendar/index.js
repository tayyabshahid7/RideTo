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
      isInstantBook,
      disablePreviousDates,
      nonInstantStartTime
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
        <div className={styles.subtitle}>
          {isInstantBook ? 'Choose a time' : 'Training time:'}
        </div>

        {isInstantBook ? (
          calendar.selectedDate && (
            <CalendarTime
              calendar={calendar}
              courses={courses.filter(
                course => course.date === calendar.selectedDate
              )}
              handleTimeSelect={handleTimeSelect}
            />
          )
        ) : (
          <button className={classnames(styles.btn, styles.activeBtn)}>
            {nonInstantStartTime.substring(0, 5)}
          </button>
        )}
      </div>
    )
  }
}

export default AvailabilityCalendar
