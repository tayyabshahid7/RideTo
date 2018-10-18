import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import { fetchWidgetCourses } from 'services/course'
import { DATE_FORMAT } from 'common/constants'
import { getMotorbikeLabel } from 'services/widget'
import { parseQueryString } from 'services/api'

class CourseAvailabilityComponent extends React.Component {
  constructor(props) {
    super(props)
    let date = new Date(this.props.date) || new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth()
      },
      courses: []
    }
  }

  componentDidMount() {
    this.loadCourses()
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
      this.loadCourses()
    }
  }

  async loadCourses() {
    const { year, month } = this.state.calendar
    const { course } = this.props
    let momentDate = moment(new Date(year, month, 1))
    const qs = parseQueryString(window.location.search.slice(1))
    const courseType = qs.courseType

    const courses = await fetchWidgetCourses(
      course.id,
      momentDate.format('YYYY-MM-DD'),
      momentDate.endOf('month').format('YYYY-MM-DD'),
      courseType
    )
    this.setState({ courses })
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

  generateDaysDataFromCalendar(course, calendar) {
    const { courses } = this.state
    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    let todate = moment().format(DATE_FORMAT)
    return dates.map(date => {
      let momentDate = moment(date)
      let dateInString = momentDate.format('YYYY-MM-DD')
      let disabled = false
      let invisible = date.getMonth() !== calendar.month
      let dayCourses = courses.filter(course => course.date === dateInString)
      if (
        course.excluded_days &&
        course.excluded_days.includes(momentDate.format('dddd'))
      ) {
        disabled = true
      }

      if (
        course.excluded_dates &&
        course.excluded_dates.includes(dateInString)
      ) {
        disabled = true
      }

      if (dateInString < todate) {
        disabled = true
      }

      if (course.instant_book && dayCourses.length === 0) {
        disabled = true
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
      onUpdate
    } = this.props
    const { calendar, courses } = this.state
    let days = this.generateDaysDataFromCalendar(course, calendar)

    const fullText = <span className={styles.full}> - Fully Booked</span>
    const isAutoFull =
      instantCourse && instantCourse.auto_count === instantCourse.auto_bikes
    const isManualFull =
      instantCourse && instantCourse.manual_count === instantCourse.manual_bikes

    return (
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
          showTime={!!course.instant_book}
          showChooseDate={true}
          courses={courses}
          disablePreviousDates
        />
        <div className={styles.bikeHireWrapper}>
          <label className={styles.subtitle1}>Choose A Bike to Hire</label>

          {course.course_type === 'LICENCE_CBT_RENEWAL' && (
            <button
              className={classnames(
                styles.bikeHireBtn,
                bike_hire === 'no' && styles.activeBtn
              )}
              onClick={() => onUpdate({ bike_hire: 'no' })}>
              {getMotorbikeLabel('no')}
            </button>
          )}
          <button
            className={classnames(
              styles.bikeHireBtn,
              bike_hire === 'auto' && styles.activeBtn
            )}
            onClick={() => onUpdate({ bike_hire: 'auto' })}
            disabled={isAutoFull}>
            {getMotorbikeLabel('auto')}
            {isAutoFull ? fullText : null}
          </button>
          <button
            className={classnames(
              styles.bikeHireBtn,
              bike_hire === 'manual' && styles.activeBtn
            )}
            onClick={() => onUpdate({ bike_hire: 'manual' })}
            disabled={isManualFull}>
            {getMotorbikeLabel('manual')}
            {isManualFull ? fullText : null}
          </button>
        </div>
      </div>
    )
  }
}

export default CourseAvailabilityComponent
