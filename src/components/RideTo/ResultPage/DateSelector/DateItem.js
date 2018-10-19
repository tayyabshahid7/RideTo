import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import { DATE_FORMAT } from 'common/constants'

const DateItem = ({
  showMonth,
  date,
  activeDate,
  handleSetDate,
  availableDates
}) => {
  let momentDate = moment(date)
  const isSelectedDate = momentDate.format(DATE_FORMAT) === activeDate
  const isToday =
    momentDate.format(DATE_FORMAT) === moment().format(DATE_FORMAT)
  const isDisabledDate =
    availableDates && !availableDates.includes(momentDate.format(DATE_FORMAT))
  const disabled =
    momentDate <=
      moment()
        .hour(17)
        .minute(30) || isDisabledDate
  return (
    <div className={styles.dateWrapper}>
      <span className={styles.month}>
        {showMonth || date.getDate() === 1 ? momentDate.format('MMMM') : ' '}
      </span>
      <div
        className={classnames(
          isToday && styles.today,
          styles.dateComponent,
          isSelectedDate && styles.active,
          disabled && styles.disabled
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
