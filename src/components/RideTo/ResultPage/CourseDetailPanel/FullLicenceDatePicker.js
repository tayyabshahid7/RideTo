import React, { Component } from 'react'
import styles from './styles.scss'
import moment from 'moment'
import { getDasAvailableDates } from 'services/course'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import { DATE_FORMAT } from 'common/constants'

class FullLicenceDatePicker extends Component {
  constructor(props) {
    super(props)
    let date = new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth()
      },
      days: []
    }

    this.container = React.createRef()
    this.handleChangeClick = this.handleChangeClick.bind(this)
  }

  getFirstDate({ year, month }) {
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

  async generateDaysDataFromCalendar(calendar) {
    const { schoolId, licence, bike_hire, type, start_date } = this.props
    let availableDates = []

    if (start_date) {
      availableDates = await getDasAvailableDates(
        schoolId,
        licence,
        bike_hire,
        type,
        start_date
      )
    }

    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    let todate = moment().format(DATE_FORMAT)
    return dates.map(date => {
      let disabled = false
      let momentDate = moment(date)
      let invisible = date.getMonth() !== calendar.month
      let dateInString = momentDate.format(DATE_FORMAT)

      // Get the available date object
      let availableDate = availableDates.filter(d => d.date === dateInString)[0]
      let course_id = availableDate && availableDate.course_id
      let time = availableDate && availableDate.time

      // Date is earlier than today
      if (dateInString < todate) {
        disabled = true
      }

      // If date isn't available
      if (!availableDate) {
        disabled = true
      }

      return { date, disabled, invisible, course_id, time }
    })
  }

  generateCalendarDaysForMonth({ year, month }) {
    let firstDate = this.getFirstDate({
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

  async handlePrevMonth() {
    const { calendar } = this.state
    let month = calendar.month - 1
    let year = calendar.year
    if (month < 0) {
      month = 11
      year = year - 1
    }
    const days = await this.generateDaysDataFromCalendar({
      ...calendar,
      month,
      year
    })
    this.setState({ days, calendar: { ...calendar, month, year } })
  }

  async handleNextMonth() {
    const { calendar } = this.state
    let month = calendar.month + 1
    let year = calendar.year
    if (month > 11) {
      month = 0
      year = year + 1
    }
    const days = await this.generateDaysDataFromCalendar({
      ...calendar,
      month,
      year
    })
    this.setState({ days, calendar: { ...calendar, month, year } })
  }

  handleDateSelect(date, course_id, time) {
    const { onSelectPackageDate, index } = this.props
    onSelectPackageDate(index, {
      date,
      course_id,
      time
    })
  }

  handleChangeClick() {
    const { onSelectPackageDate, index } = this.props
    onSelectPackageDate(index, {
      date: '',
      course_id: null,
      time: ''
    })
  }

  async componentDidMount() {
    const { index } = this.props
    const { calendar } = this.state

    if (index === 0) {
      this.container.current.scrollIntoView()

      const days = await this.generateDaysDataFromCalendar(calendar)
      this.setState({
        days
      })
    }
  }

  async componentDidUpdate(prevProps) {
    const { showCalendar } = this.props
    const { calendar } = this.state

    if (showCalendar !== prevProps.showCalendar && showCalendar) {
      this.container.current.scrollIntoView()

      const days = await this.generateDaysDataFromCalendar(calendar)

      console.log(days)

      this.setState({
        days
      })
    }
  }

  render() {
    const { date, index, showCalendar } = this.props
    const { calendar, days } = this.state

    const content = () => {
      if (!date.date) {
        if (showCalendar) {
          return (
            <AvailabilityCalendar
              showLabel={false}
              showTrainingTime={false}
              days={days}
              calendar={{ ...calendar, selectedDate: date.date }}
              handleDateSelect={this.handleDateSelect.bind(this)}
              handlePrevMonth={this.handlePrevMonth.bind(this)}
              handleNextMonth={this.handleNextMonth.bind(this)}
              disablePreviousDates
            />
          )
        }

        return <div className={styles.noDateSelected}>No Date selected</div>
      }

      return (
        <div className={styles.dateSelected}>
          <div className={styles.selectedInfo}>
            <span className={styles.checked}>✓</span>
            <span>
              {new Date(date.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
          <button
            className={styles.changeButton}
            onClick={this.handleChangeClick}>
            Change
          </button>
        </div>
      )
    }

    return (
      <div ref={this.container}>
        <div className={styles.datePickerHeader}>
          <span>{index + 1}</span>
          <h5>{date.title}</h5>
        </div>
        {content()}
      </div>
    )
  }
}

export default FullLicenceDatePicker
