import React, { Component } from 'react'
import classnames from 'classnames'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import CalendarContent from './CalendarContent'
import CalendarTime from './CalendarTime'
import moment from 'moment'

class AvailabilityCalendar extends Component {
  componentDidUpdate(prevProps, prevState) {
    const {
      calendar: { selectedDate },
      days,
      isInstantBook
    } = this.props
    if (selectedDate && this.isSelectedDateDisabled(selectedDate, days)) {
      const firstAvailableDate = this.getFirstAvailableDate(days, isInstantBook)
      this.props.handleDateSelect(firstAvailableDate)
    }
  }

  getFirstAvailableDate(days, isInstantBook) {
    for (let i = 0; i < days.length; i++) {
      if (!days[i].disabled) {
        if (!isInstantBook) {
          return moment(days[i].date).format('YYYY-MM-DD')
        } else if (days.courses.length > 0) {
          return moment(days[i].date).format('YYYY-MM-DD')
        }
      }
    }
  }

  isSelectedDateDisabled(date, days) {
    const selectedDate = moment(date)
    for (let i = 0; i < days.length; i++) {
      if (days[i].disabled && days[i].date.getDate() === selectedDate.date()) {
        return true
      }
    }
    return false
  }

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
      nonInstantStartTime,
      showTrainingTime = true
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
        {showTrainingTime && (
          <React.Fragment>
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
                {nonInstantStartTime && nonInstantStartTime.substring(0, 5)}
              </button>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default AvailabilityCalendar
