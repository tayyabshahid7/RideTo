import React from 'react'

import moment from 'moment'
import styles from './styles.scss'

export default function AvailableDateBox({ date, time, price, onClick }) {
  const formattedPrice = Math.trunc(price / 100)

  const formattedDate = moment(date).format('ddd MMM DD')
  const formattedTime = moment(time, 'h:mm').format('hh:mma')

  return (
    <div>
      <button className={styles.box} onClick={onClick}>
        <span className={styles.date}>{formattedDate}</span>
        <span className={styles.time}>{formattedTime}</span>
        <span className={styles.price}>£{formattedPrice}</span>
      </button>
    </div>
  )
}
