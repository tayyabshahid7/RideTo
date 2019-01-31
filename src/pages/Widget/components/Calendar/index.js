import React from 'react'
import moment from 'moment'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import Loading from 'components/Loading'
import { asPoundSterling } from 'services/widget'

import styles from './Calendar.scss'

moment.updateLocale('en', {
  week: {
    dow: 1
  }
})

const renderDayContents = (day, courses) => {
  const dateStr = day.format('YYYY-MM-DD')
  const course = courses.filter(c => c.date === dateStr)[0]
  const price =
    course && course.pricing ? asPoundSterling(course.pricing.price) : ''

  return (
    <div className={styles.day}>
      <div className={styles.dayDate}>{day.format('DD')}</div>
      <strong className={styles.dayPrice}>{price}</strong>
    </div>
  )
}

const isDayBlocked = (day, courses) => {
  const formatted = day.format('YYYY-MM-DD')
  if (
    moment().hour() >= 18 &&
    day.format('YYYY-MM-DD') ===
      moment()
        .add(1, 'day')
        .format('YYYY-MM-DD')
  ) {
    return true
  } else {
    return courses.filter(({ date }) => date === formatted).length === 0
  }
}

class Calendar extends React.Component {
  shouldComponentUpdate({ date, courses, isLoading }) {
    if (this.props.isLoading !== isLoading) {
      return true
    }

    if (this.props.date !== date) {
      return true
    }

    if (this.props.courses.length !== courses.length) {
      return true
    }

    if (this.props.courses.length && courses.length) {
      const courseId = this.props.courses[0].id
      if (courseId !== courses[0].id) {
        return true
      }
    }

    return false
  }

  render() {
    const {
      date,
      courses,
      onChangeDate,
      onChangeMonth,
      isLoading,
      optionsSelected
    } = this.props

    if (!isLoading && !date) {
      if (optionsSelected) {
        return <div className={styles.noCourses}>No Courses Available</div>
      } else {
        return <div className={styles.noCourses}>Please select options</div>
      }
    }

    return (
      <div className={styles.calendar}>
        <SingleDatePicker
          numberOfMonths={1}
          renderDayContents={day => renderDayContents(day, courses)}
          onDateChange={onChangeDate}
          date={date}
          daySize={40}
          onFocusChange={() => {}}
          keepOpenOnDateSelect={true}
          hideKeyboardShortcutsPanel={true}
          focused={true}
          isDayBlocked={day => isDayBlocked(day, courses)}
          onNextMonthClick={onChangeMonth}
          onPrevMonthClick={onChangeMonth}
        />
        {isLoading ? (
          <div className={styles.spinner}>
            <Loading loading={true} />
          </div>
        ) : null}
      </div>
    )
  }
}

export default Calendar
