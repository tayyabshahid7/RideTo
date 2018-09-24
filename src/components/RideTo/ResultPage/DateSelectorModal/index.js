import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

class DateSelectorModal extends React.Component {
  constructor(props) {
    super(props)
    let date = new Date(this.props.date)
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth(),
        selectedDate: this.props.date,
        selectedTime: null
      }
    }
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

  generateDaysDataFromCalendar(calendar) {
    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    return dates.map(date => {
      // let momentDate = moment(date)
      // let dateInString = momentDate.format('YYYY-MM-DD')
      let disabled = false
      let invisible = date.getMonth() !== calendar.month
      // if (
      //   course.excluded_days &&
      //   course.excluded_days.includes(momentDate.format('dddd'))
      // ) {
      //   disabled = true
      // }

      // if (
      //   course.excluded_dates &&
      //   course.excluded_dates.includes(dateInString)
      // ) {
      //   disabled = true
      // }

      return { date, disabled, invisible }
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
    this.setState({ calendar: { ...calendar, selectedDate } })
  }

  handleTimeSelect(selectedTime) {
    const { calendar } = this.state
    this.setState({ calendar: { ...calendar, selectedTime } })
  }

  render() {
    const { isOpen, onClose, onSelect } = this.props
    const { calendar } = this.state
    let days = this.generateDaysDataFromCalendar(calendar)
    return (
      <Modal
        isOpen={isOpen}
        toggle={onClose}
        size={'md'}
        className={styles.mobileFull}>
        <ModalHeader toggle={onClose} />
        <ModalBody>
          <AvailabilityCalendar
            days={days}
            calendar={calendar}
            handleDateSelect={this.handleDateSelect.bind(this)}
            handlePrevMonth={this.handlePrevMonth.bind(this)}
            handleNextMonth={this.handleNextMonth.bind(this)}
            handleTimeSelect={this.handleTimeSelect.bind(this)}
          />
        </ModalBody>
        <button
          className={classnames('btn btn-primary', styles.selectDate)}
          onClick={() => onSelect(calendar.selectedDate)}>
          <span>Choose Date</span>
          <img src={ButtonArrowWhite} alt="arrow" />
        </button>
      </Modal>
    )
  }
}

export default DateSelectorModal
