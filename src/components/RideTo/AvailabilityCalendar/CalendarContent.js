import React, { Component } from 'react'
import CalendarDayCell from './CalendarDayCell'
import styles from './CalendarContent.scss'
import moment from 'moment'
import { BANK_HOLIDAYS } from 'common/constants'
class CalendarContent extends Component {
  constructor(props) {
    super(props)
    this.getDayPrice = this.getDayPrice.bind(this)
  }
  renderWeekdays() {
    return (
      <ul className={styles.calendarWeekdays}>
        <li>Mo</li>
        <li>Tu</li>
        <li>We</li>
        <li>Th</li>
        <li>Fr</li>
        <li>Sa</li>
        <li>Su</li>
      </ul>
    )
  }

  isBankHoliday(date) {
    return BANK_HOLIDAYS.includes(date)
  }

  getDayPrice(day) {
    const { isInstantBook, nonInstantPrices } = this.props

    if (day.disabled) return null
    if (isInstantBook) {
      return day.courses[0].pricing.price / 100
    }
    if (this.isBankHoliday(moment(day.date).format('DD-MM-YYYY'))) {
      return nonInstantPrices.bank_holiday
    } else if (day.date.getDay() === 6 || day.date.getDay() === 0) {
      // saturdary and sunday
      return nonInstantPrices.weekend
    } else {
      return nonInstantPrices.weekday
    }
  }

  renderDays() {
    const { days, calendar, handleDateSelect } = this.props

    return (
      <ul className={styles.calendarDays}>
        {days.map((day, index) => (
          <CalendarDayCell
            day={day}
            price={this.getDayPrice(day)}
            calendar={calendar}
            key={index}
            handleDateSelect={handleDateSelect}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderWeekdays()}
        <div className={styles.daysContainer}>{this.renderDays()}</div>
      </div>
    )
  }
}

export default CalendarContent
