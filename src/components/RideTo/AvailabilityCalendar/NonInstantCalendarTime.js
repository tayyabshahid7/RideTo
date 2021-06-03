import React from 'react'
import moment from 'moment'
import { useMediaQuery } from 'react-responsive'
import { BANK_HOLIDAYS } from 'common/constants'
import styles from './CalendarTime.scss'

const isBankHoliday = date => {
  return BANK_HOLIDAYS.includes(date)
}

export default function NonInstantCalendarTime({ date, startTimes }) {
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const mdate = moment(date)
  let time = null
  if (isBankHoliday(mdate.format('DD-MM-YYYY'))) {
    time = startTimes.bankHoliday.substring(0, 5)
  }
  if (mdate.day() === 6 || mdate.day() === 0) {
    time = startTimes.weekend.substring(0, 5)
  } else {
    time = startTimes.weekday.substring(0, 5)
  }

  if (!isMobile) {
    return time
  }

  return (
    <span className={styles.courseTime}>
      <b>{mdate.format('D MMMM')} - </b>
      {time}
    </span>
  )
}
