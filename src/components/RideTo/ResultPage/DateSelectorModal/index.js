import React from 'react'
import moment from 'moment'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import { checkAllowedDate } from 'services/date'

class DateSelectorModal extends React.Component {
  constructor(props) {
    super(props)
    let date = this.props.date ? new Date(this.props.date) : new Date()
    this.state = {
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth(),
        selectedDate: this.props.date
      }
    }
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
    return dates.map(date => {
      let disabled = false
      let invisible = date.getMonth() !== calendar.month
      if (!checkAllowedDate(date)) {
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

  handleDateSelect(selectedDate, courseId, time, viaClick) {
    const { onSelectDate } = this.props
    const { calendar } = this.state
    this.setState({ calendar: { ...calendar, selectedDate } })

    if (viaClick === true) {
      onSelectDate(selectedDate)
    }
  }

  render() {
    const { isOpen, onClose } = this.props
    const { calendar } = this.state
    let days = this.generateDaysDataFromCalendar(calendar)
    return (
      <Modal
        id="date-selector"
        isOpen={isOpen}
        toggle={onClose}
        size={'md'}
        className={styles.mobileFull}
        fade={false}>
        <ModalHeader toggle={onClose} />
        <ModalBody>
          <AvailabilityCalendar
            isModal
            showTrainingTime={false}
            days={days}
            calendar={calendar}
            handleDateSelect={this.handleDateSelect.bind(this)}
            handlePrevMonth={this.handlePrevMonth.bind(this)}
            handleNextMonth={this.handleNextMonth.bind(this)}
            disablePreviousDates
          />
        </ModalBody>
      </Modal>
    )
  }
}

export default DateSelectorModal
