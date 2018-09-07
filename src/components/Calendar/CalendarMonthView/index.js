import React, { Component } from 'react'
// import classnames from 'classnames'
import CalendarWeekdays from '../CalendarWeekdays'
import CalendarDays from '../CalendarDays'
import styles from './index.scss'

class CalendarMonthView extends Component {
  componentDidMount() {
    setTimeout(() => {
      let element = document.getElementsByClassName('axis-date')
      if (element && element.length > 0) {
        element[element.length - 1].scrollIntoView()
      }
    }, 500)
  }

  render() {
    return (
      <div className={styles.container}>
        <CalendarWeekdays />
        <div className={styles.daysContainer}>
          <CalendarDays {...this.props} />
        </div>
      </div>
    )
  }
}

export default CalendarMonthView
