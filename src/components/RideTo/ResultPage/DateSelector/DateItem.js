import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import { DATE_FORMAT } from 'common/constants'

const DateItem = ({ showMonth, date, activeDate, handleSetDate }) => {
  let momentDate = moment(date)
  let isSelectedDate = momentDate.format(DATE_FORMAT) === activeDate
  let isToday = momentDate.format(DATE_FORMAT) === moment().format(DATE_FORMAT)
  let disabled =
    momentDate <=
    moment()
      .hour(17)
      .minute(30)
  return (
    <div
      className={classnames(styles.dateWrapper, disabled && styles.disabled)}>
      <span className={styles.month}>
        {showMonth || date.getDate() === 1 ? momentDate.format('MMMM') : ' '}
      </span>
      <div
        className={classnames(
          isToday && styles.today,
          styles.dateComponent,
          isSelectedDate && styles.active
        )}
        onClick={() => !disabled && handleSetDate(date)}>
        {momentDate.format('ddd')}
        <br />
        {momentDate.format('DD')}
      </div>
    </div>
  )
}

export default DateItem
