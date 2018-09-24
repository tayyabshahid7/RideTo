import React, { Component } from 'react'
import CalendarDayCell from './CalendarDayCell'
import styles from './CalendarContent.scss'

class CalendarMonthView extends Component {
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

  renderDays() {
    const { days, calendar, handleDateSelect } = this.props
    return (
      <ul className={styles.calendarDays}>
        {days.map((day, index) => (
          <CalendarDayCell
            day={day}
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

export default CalendarMonthView
