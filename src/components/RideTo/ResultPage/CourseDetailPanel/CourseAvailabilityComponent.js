import React from 'react'
import moment from 'moment'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import { fetchWidgetCourses } from 'services/course'
import { DATE_FORMAT } from 'common/constants'

class CourseAvailabilityComponent extends React.Component {
  constructor(props) {
    super(props)
    let date = new Date(this.props.date) || new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth(),
        selectedDate: moment(date).format(DATE_FORMAT)
      },
      courses: []
    }
  }

  componentDidMount() {
    this.loadCourses()
  }

  componentDidUpdate(prevProps, prevState) {
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

    const courses = await fetchWidgetCourses(
      course.id,
      momentDate.format('YYYY-MM-DD'),
      momentDate.endOf('month').format('YYYY-MM-DD')
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
      month = 0
      year = year - 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleNextMonth() {
    const { calendar } = this.state
    let month = calendar.month + 1
    let year = calendar.year
    if (month > 11) {
      month = 11
      year = year + 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleDateSelect(selectedDate) {
    const { calendar } = this.state
    const { onSelectInstantCourse } = this.props
    let selectedCourse =
      calendar.selectedDate === selectedDate ? calendar.selectedCourse : null
    this.setState({ calendar: { ...calendar, selectedDate } })
    onSelectInstantCourse(selectedCourse)
  }

  handleTimeSelect(selectedCourse) {
    const { onSelectInstantCourse } = this.props
    onSelectInstantCourse(selectedCourse)
  }

  render() {
    const { course, instantCourse } = this.props
    const { calendar, courses } = this.state
    let days = this.generateDaysDataFromCalendar(course, calendar)
    return (
      <div className={styles.content}>
        <AvailabilityCalendar
          days={days}
          calendar={{ ...calendar, selectedCourse: instantCourse }}
          handleDateSelect={this.handleDateSelect.bind(this)}
          handlePrevMonth={this.handlePrevMonth.bind(this)}
          handleNextMonth={this.handleNextMonth.bind(this)}
          handleTimeSelect={this.handleTimeSelect.bind(this)}
          showDateTime={true}
          courses={courses}
          disablePreviousDates
        />
      </div>
    )
  }
}

export default CourseAvailabilityComponent
