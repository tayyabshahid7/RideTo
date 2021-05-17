import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import CalendarContent from './CalendarContent'
import CalendarTime from './CalendarTime'
import CalendarSpacesAvailable from './CalendarSpacesAvailable'
import moment from 'moment'
import _ from 'lodash'
import { BANK_HOLIDAYS } from 'common/constants'
import { fetchPlatformCourses } from 'services/course'

const isBankHoliday = date => {
  return BANK_HOLIDAYS.includes(date)
}

class AvailabilityCalendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateAlreadyChecked: false,
      bankHolidays: null,
      futureChecked: false
    }
  }

  componentDidMount() {
    const {
      calendar: { selectedDate },
      days,
      isInstantBook,
      checkFutureMonth
    } = this.props
    const { futureChecked } = this.state

    // For non instant booking calendars
    if (
      !isInstantBook &&
      selectedDate &&
      this.isSelectedDateDisabled(selectedDate, days)
    ) {
      this.setFirstAvailableDate(days, isInstantBook)
    }

    if (checkFutureMonth && !isInstantBook && !selectedDate && !futureChecked) {
      this.findFirstMonth(days)
    }
  }

  async findFirstMonth(days) {
    const { handleNextMonth } = this.props

    this.setState({
      futureChecked: true
    })

    if (days.length && !days.some(({ disabled }) => !disabled)) {
      const {
        course,
        courseType,
        calendar: { year, month },
        isInstantBook
      } = this.props

      // If it isn't instant book, go to the next month
      if (!isInstantBook) {
        handleNextMonth()
        return
      }

      let momentDate = moment(new Date(year, month, 1)).add(1, 'months')

      const courses = await fetchPlatformCourses(
        course.id,
        momentDate.format('YYYY-MM-DD'),
        momentDate.endOf('month').format('YYYY-MM-DD'),
        courseType
      )

      if (courses.length) {
        handleNextMonth()
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      calendar: { selectedDate },
      days,
      isInstantBook,
      courses,
      handleTimeSelect,
      loading,
      checkFutureMonth
    } = this.props
    const { futureChecked } = this.state

    if (
      checkFutureMonth &&
      isInstantBook &&
      !selectedDate &&
      loading !== prevProps.loading &&
      !loading &&
      !futureChecked
    ) {
      this.findFirstMonth(days)
    }

    // For instant booking calendars
    if (isInstantBook && courses.length > 0 && !this.state.dateAlreadyChecked) {
      if (this.isSelectedDateDisabled(selectedDate, days)) {
        this.setFirstAvailableDate(days, isInstantBook)
      }
      this.setState({ dateAlreadyChecked: true })
    }

    // Auto set calendar time if only one time available
    if (
      isInstantBook &&
      courses.length > 0 &&
      selectedDate !== prevProps.calendar.selectedDate
    ) {
      const filteredCourses =
        courses && courses.filter(course => course.date === selectedDate)

      if (filteredCourses.length === 1) {
        handleTimeSelect(filteredCourses[0])
      }
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
    let filteredCourses =
      courses && courses.filter(course => course.date === calendar.selectedDate)
    filteredCourses = _.sortBy(filteredCourses, 'time')
    const hasManyTimes = isInstantBook && filteredCourses.length > 1

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
          <Fragment>
            {isInstantBook && calendar.selectedDate && (
              <CalendarSpacesAvailable
                courses={filteredCourses}
                calendar={calendar}
              />
            )}
            <div className={classnames(!hasManyTimes && styles.singleTime)}>
              <div
                id={isInstantBook ? 'choose-time-validate' : ''}
                className={styles.subtitle}>
                {hasManyTimes ? 'Choose a time' : 'Course Start Time:'}
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
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}

export default AvailabilityCalendar
