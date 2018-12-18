import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import Loading from 'components/Loading'
import { fetchWidgetCourses } from 'services/course'
import { DATE_FORMAT } from 'common/constants'
import { getMotorbikeLabel } from 'services/widget'

class CourseAvailabilityComponent extends React.Component {
  constructor(props) {
    super(props)
    let date = new Date(this.props.date) || new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth()
      },
      courses: [],
      loadingCourses: false
    }
  }

  componentDidMount() {
    if (this.props.course.instant_book) {
      this.setState({ loadingCourses: true }, () => this.loadCourses())
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { course } = this.props
    if (!course.instant_book) {
      return
    }
    if (
      prevState.calendar.year !== this.state.calendar.year ||
      prevState.calendar.month !== this.state.calendar.month
    ) {
      this.setState({ loadingCourses: true }, () => this.loadCourses())
    }
  }

  async loadCourses() {
    const { year, month } = this.state.calendar
    const { course, courseType } = this.props
    let momentDate = moment(new Date(year, month, 1))

    const courses = await fetchWidgetCourses(
      course.id,
      momentDate.format('YYYY-MM-DD'),
      momentDate.endOf('month').format('YYYY-MM-DD'),
      courseType
    )
    this.setState({ courses, loadingCourses: false })
  }

  getFirstAndLastDate({ year, month }) {
    let oneDay = 1000 * 60 * 60 * 24
    let firstDay = new Date(year, month, 1)
    let dayOne = firstDay.getDay()
    if (dayOne === 0) {
      dayOne = 6
    } else {
      dayOne--
    }
    let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
    return firstDateInMonthCalendar
  }

  generateDaysDataFromCalendar(courseLocation, calendar) {
    const { courses } = this.state
    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    let today = moment()
    let tomorrow = moment()
      .add(1, 'days')
      .hour(18)
      .minutes(0)
    return dates.map(date => {
      let momentDate = moment(date)
      let dateInString = momentDate.format('YYYY-MM-DD')
      let disabled = false
      let invisible = date.getMonth() !== calendar.month
      let dayCourses = courses.filter(
        courseLocation => courseLocation.date === dateInString
      )
      if (
        courseLocation.excluded_days &&
        courseLocation.excluded_days.includes(momentDate.format('dddd'))
      ) {
        disabled = true
      }

      if (
        courseLocation.excluded_dates &&
        courseLocation.excluded_dates.includes(dateInString)
      ) {
        disabled = true
      }

      if (dateInString <= today.format(DATE_FORMAT)) {
        disabled = true
      } else if (
        momentDate.date() === tomorrow.date() &&
        today.add(1, 'days') > tomorrow
      ) {
        disabled = true
      }

      if (courseLocation.instant_book) {
        for (let i = dayCourses.length - 1; i >= 0; i--) {
          if (dayCourses[i].order_count >= dayCourses[i].spaces) {
            dayCourses.splice(i, 1)
          }
        }
        if (dayCourses.length === 0) {
          disabled = true
        }
      }

      return { date, disabled, invisible, courses: dayCourses }
    })
  }

  generateCalendarDaysForMonth({ year, month }) {
    let firstDate = this.getFirstAndLastDate({
      year,
      month
    })

    let dayLast = new Date(year, month + 1, 0)

    let days = []
    let diffDays = moment(dayLast).diff(moment(firstDate), 'days')
    let monthViewDays = diffDays < 35 ? 35 : 42
    for (let i = 0; i < monthViewDays; i++) {
      let date = new Date(firstDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  handlePrevMonth() {
    const { calendar } = this.state
    let month = calendar.month - 1
    let year = calendar.year
    if (month < 0) {
      month = 11
      year = year - 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleNextMonth() {
    const { calendar } = this.state
    let month = calendar.month + 1
    let year = calendar.year
    if (month > 11) {
      month = 0
      year = year + 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleDateSelect(instantDate) {
    const { calendar } = this.state
    const { onUpdate } = this.props
    let instantCourse =
      this.props.instantDate === instantDate ? this.props.instantCourse : null
    this.setState({ calendar: { ...calendar } })
    onUpdate({ instantCourse, instantDate })
  }

  handleTimeSelect(instantCourse) {
    const { onUpdate } = this.props
    onUpdate({ instantCourse })
  }

  handleChangeRawEvent(event) {
    const { onUpdate } = this.props
    onUpdate({ [event.target.name]: event.target.value })
  }

  render() {
    const {
      course,
      instantCourse,
      instantDate,
      bike_hire,
      onUpdate,
      courseType
    } = this.props
    const { calendar, courses, loadingCourses } = this.state
    let days = this.generateDaysDataFromCalendar(course, calendar)

    const fullText = <span className={styles.full}> - Fully Booked</span>
    const manualText = (
      <span className={styles.manualInfo}>
        Please note: If you haven’t ridden a manual (geared) bike before and
        expect to complete the CBT training in one day, you may find you need
        additional training to complete your CBT. If your not sure, call us on
        02036039652 to talk to a member of our friendly team.
      </span>
    )
    const isAutoFull =
      instantCourse && instantCourse.auto_count === instantCourse.auto_bikes
    const isManualFull =
      instantCourse && instantCourse.manual_count === instantCourse.manual_bikes

    const isCbtRenewal = courseType === 'LICENCE_CBT_RENEWAL'

    return (
      <Loading loading={loadingCourses}>
        <div className={styles.content}>
          <AvailabilityCalendar
            days={days}
            calendar={{
              ...calendar,
              selectedCourse: instantCourse,
              selectedDate: instantDate
            }}
            handleDateSelect={this.handleDateSelect.bind(this)}
            handlePrevMonth={this.handlePrevMonth.bind(this)}
            handleNextMonth={this.handleNextMonth.bind(this)}
            handleTimeSelect={this.handleTimeSelect.bind(this)}
            isInstantBook={!!course.instant_book}
            nonInstantPrices={course.week_prices}
            nonInstantStartTime={course.startTime}
            showChooseDate={true}
            courses={courses}
            disablePreviousDates
          />
          <div className={styles.bikeHireWrapper}>
            <label id="choose-bike" className={styles.subtitle1}>
              Choose A Bike to Hire
            </label>

            {isCbtRenewal && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  bike_hire === 'no' && styles.activeBtn
                )}
                onClick={() => onUpdate({ bike_hire: 'no' })}>
                {getMotorbikeLabel('no')}
              </button>
            )}
            {bike_hire === 'no' && (
              <div className={styles.ownBikeDisclaimer}>
                You must bring a valid CBT Certificate, Insurance Documents, Tax
                and MOT if you wish to train on your own bike.
              </div>
            )}
            {course.has_auto_bikes && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  bike_hire === 'auto' && styles.activeBtn
                )}
                onClick={() => onUpdate({ bike_hire: 'auto' })}
                disabled={isAutoFull}>
                {getMotorbikeLabel('auto')}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isAutoFull ? fullText : null}
              </button>
            )}
            {course.has_manual_bikes && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  bike_hire === 'manual' && styles.activeBtn
                )}
                onClick={() => onUpdate({ bike_hire: 'manual' })}
                disabled={isManualFull}>
                {getMotorbikeLabel('manual')}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isManualFull ? fullText : null}
              </button>
            )}
            {bike_hire === 'manual' && manualText}
          </div>
        </div>
      </Loading>
    )
  }
}

export default CourseAvailabilityComponent
