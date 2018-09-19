import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import { DATE_FORMAT } from 'common/constants'

const DateItem = ({ showMonth, date, activeDate, handleSetDate }) => {
  let momentDate = moment(date)
  let isActive = momentDate.format(DATE_FORMAT) === activeDate
  return (
    <div className={classnames(styles.dateWrapper)}>
      <span className={styles.month}>
        {showMonth || date.getDate() === 1 ? momentDate.format('MMMM') : ' '}
      </span>
      <div
        className={classnames(styles.dateComponent, isActive && styles.active)}
        onClick={() => handleSetDate(date)}>
        {momentDate.format('ddd')}
        <br />
        {momentDate.format('DD')}
      </div>
    </div>
  )
}

export default DateItem
