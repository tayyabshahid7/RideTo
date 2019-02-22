import React, { Component } from 'react'
import classnames from 'classnames'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import CalendarContent from './CalendarContent'
import CalendarTime from './CalendarTime'
import moment from 'moment'
import { BANK_HOLIDAYS } from 'common/constants'

const isBankHoliday = date => {
  return BANK_HOLIDAYS.includes(date)
}

class AvailabilityCalendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateAlreadyChecked: false,
      bankHolidays: null
    }
  }

  componentDidMount() {
    const {
      calendar: { selectedDate },
      days,
      isInstantBook
    } = this.props
    // For non instant booking calendars
    if (
      !isInstantBook &&
      selectedDate &&
      this.isSelectedDateDisabled(selectedDate, days)
    ) {
      this.setFirstAvailableDate(days, isInstantBook)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      calendar: { selectedDate },
      days,
      isInstantBook,
      courses
    } = this.props

    // For instant booking calendars
    if (isInstantBook && courses.length > 0 && !this.state.dateAlreadyChecked) {
      if (this.isSelectedDateDisabled(selectedDate, days)) {
        this.setFirstAvailableDate(days, isInstantBook)
      }
      this.setState({ dateAlreadyChecked: true })
    }
  }

  setFirstAvailableDate(days, isInstantBook) {
    const { isModal } = this.props

    if (isModal) {
      return
    }

    for (let i = 0; days && i < days.length; i++) {
      if (!days[i].disabled) {
        if (!isInstantBook) {
          const availableDate = moment(days[i].date).format('YYYY-MM-DD')
          this.props.handleDateSelect(availableDate)
          return
        } else if (days[i].courses.length > 0) {
          const availableDate = moment(days[i].date).format('YYYY-MM-DD')
          this.props.handleDateSelect(availableDate)
          return
        }
      }
    }
    this.props.handleDateSelect(null)
  }

  isSelectedDateDisabled(date, days) {
    const selectedDate = moment(date)
    for (let i = 0; i < days.length; i++) {
      if (
        days[i].disabled &&
        days[i].date.getDate() === selectedDate.date() &&
        days[i].date.getMonth() === selectedDate.month()
      ) {
        return true
      }
    }
    return false
  }

  getStartTime(date, startTimes) {
    const mdate = moment(date)
    if (isBankHoliday(mdate.format('DD-MM-YYYY'))) {
      return startTimes.bankHoliday.substring(0, 5)
    }
    if (mdate.day() === 6 || mdate.day() === 0) {
      return startTimes.weekend.substring(0, 5)
    } else {
      return startTimes.weekday.substring(0, 5)
    }
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
      nonInstantStartTimes,
      nonInstantPrices,
      showTrainingTime = true,
      showLabel
    } = this.props
    const filteredCourses =
      courses && courses.filter(course => course.date === calendar.selectedDate)

    return (
      <div
        className={classnames(styles.container, !showLabel && styles.noLabel)}>
        <CalendarHeader
          showLabel={showLabel}
          calendar={calendar}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          disablePreviousDates={disablePreviousDates}
        />
        <CalendarContent
          isInstantBook={isInstantBook}
          nonInstantPrices={nonInstantPrices}
          days={days}
          calendar={calendar}
          handleDateSelect={handleDateSelect}
        />
        {showTrainingTime && (
          <React.Fragment>
            <div
              id={isInstantBook ? 'choose-time-validate' : ''}
              className={styles.subtitle}>
              {isInstantBook && filteredCourses.length > 1
                ? 'Choose a time'
                : 'Training time:'}
            </div>

            {isInstantBook ? (
              calendar.selectedDate && (
                <CalendarTime
                  calendar={calendar}
                  courses={filteredCourses}
                  handleTimeSelect={handleTimeSelect}
                />
              )
            ) : (
              <span className={classnames(styles.trainingTime)}>
                {nonInstantStartTimes &&
                  this.getStartTime(
                    calendar.selectedDate,
                    nonInstantStartTimes
                  )}
              </span>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default AvailabilityCalendar
