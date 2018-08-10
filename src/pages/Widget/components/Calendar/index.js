import React from 'react'
import moment from 'moment'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import styles from './Calendar.scss'

moment.updateLocale('en', {
  week: {
    dow: 1
  }
})

const renderDayContents = (day, price) => {
  return (
    <div className={styles.day}>
      <div className={styles.dayDate}>{day.format('DD')}</div>
      <strong className={styles.dayPrice}>{`£${price}`}</strong>
    </div>
  )
}

const isDayBlocked = (day, courses) => {
  const formatted = day.format('YYYY-MM-DD')

  return courses.filter(({ date }) => date === formatted).length === 0
}

class Calendar extends React.Component {
  componentDidUpdate() {
    const { color } = this.props
    const els = document.getElementsByClassName('CalendarDay__default')
    for (let i = 0; i < els.length; i++) {
      if (!els[i].classList.contains('CalendarDay__blocked_calendar')) {
        els[i].style.backgroundColor = 'initial'
        els[i].style.borderColor = '#E4E7E7'
      }
      if (els[i].classList.contains('CalendarDay__selected')) {
        els[i].style.backgroundColor = color
        els[i].style.borderColor = color
      }
    }
  }

  render() {
    const { date, courses, color, onChangeDate } = this.props
    return (
      <SingleDatePicker
        numberOfMonths={1}
        renderDayContents={day => renderDayContents(day, 120)}
        onDateChange={onChangeDate}
        date={date}
        daySize={48}
        onFocusChange={() => {}}
        keepOpenOnDateSelect={true}
        hideKeyboardShortcutsPanel={true}
        focused={true}
        isDayBlocked={day => isDayBlocked(day, courses)}
      />
    )
  }
}

export default Calendar
