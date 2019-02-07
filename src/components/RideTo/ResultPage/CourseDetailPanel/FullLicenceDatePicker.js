import React, { Component } from 'react'
import styles from './styles.scss'
import moment from 'moment'
import { getDasAvailableDates } from 'services/course'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import { DATE_FORMAT } from 'common/constants'
import classnames from 'classnames'
import Loading from 'components/Loading'

class FullLicenceDatePicker extends Component {
  constructor(props) {
    super(props)

    let date = new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth()
      },
      days: [],
      availableDates: []
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
    const { availableDates } = this.state

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

  async loadDates() {
    const { schoolId, licence, bike_hire, type, start_date } = this.props

    if (start_date) {
      this.container.current.scrollIntoView()

      const availableDates = await getDasAvailableDates(
        schoolId,
        licence,
        bike_hire,
        type,
        start_date
      )

      this.setState({ availableDates }, () => {
        const firstDate = this.state.availableDates[0]
          ? new Date(this.state.availableDates[0].date)
          : new Date()

        this.setState(
          {
            calendar: {
              year: firstDate.getFullYear(),
              month: firstDate.getMonth()
            }
          },
          async () => {
            const days = await this.generateDaysDataFromCalendar(
              this.state.calendar
            )
            this.setState({
              days
            })
          }
        )
      })
    }
  }

  componentDidMount() {
    const { index } = this.props

    if (index === 0) {
      this.loadDates()
    }
  }

  componentDidUpdate(prevProps) {
    const { showCalendar } = this.props

    if (showCalendar !== prevProps.showCalendar && showCalendar) {
      this.loadDates()
    }
  }

  render() {
    const { date, index, showCalendar, isWidget } = this.props
    const { calendar, days } = this.state

    const content = () => {
      if (!date.date) {
        if (showCalendar) {
          return (
            <Loading loading={!days.length}>
              <div className={styles.fullLicenceCalendar}>
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
              </div>
            </Loading>
          )
        }

        return <div className={styles.noDateSelected}>No Date selected</div>
      }

      return (
        <div
          className={classnames(
            styles.dateSelected,
            isWidget && styles.widgetDateSelected
          )}>
          <div className={styles.selectedInfo}>
            <span className={styles.checked}>✓</span>
            <span>
              {new Date(date.date).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'long'
              })}{' '}
              - {date.time.slice(0, -3)}
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
