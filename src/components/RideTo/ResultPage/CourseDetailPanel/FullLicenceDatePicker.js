import React, { Component } from 'react'
import styles from './styles.scss'
import moment from 'moment'
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
      }
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

  generateDaysDataFromCalendar(calendar) {
    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    let todate = moment().format(DATE_FORMAT)
    return dates.map(date => {
      let disabled = false
      let momentDate = moment(date)
      let invisible = date.getMonth() !== calendar.month
      let dateInString = momentDate.format(DATE_FORMAT)
      if (dateInString < todate) {
        disabled = true
      }
      return { date, disabled, invisible }
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

  handleDateSelect(selectedDate) {
    const { onSelectPackageDate, index } = this.props
    onSelectPackageDate(index, selectedDate)
  }

  handleChangeClick() {
    const { onSelectPackageDate, index } = this.props
    onSelectPackageDate(index, '')
  }

  componentDidMount() {
    const { index } = this.props

    if (index === 0) {
      this.container.current.scrollIntoView()
    }
  }

  componentDidUpdate(prevProps) {
    const { showCalendar } = this.props

    if (showCalendar !== prevProps.showCalendar && showCalendar) {
      this.container.current.scrollIntoView()
    }
  }

  render() {
    const { date, index, showCalendar } = this.props
    const { calendar } = this.state
    let days = this.generateDaysDataFromCalendar(calendar)

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
          <span>
            {new Date(date.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </span>
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
