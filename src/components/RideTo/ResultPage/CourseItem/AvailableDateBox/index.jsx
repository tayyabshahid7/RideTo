import React from 'react'

import moment from 'moment'
import styles from './styles.scss'

export default function AvailableDateBox({
  date,
  time,
  price,
  index,
  arrSize,
  onClick,
  moreDatesOnClick
}) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(price / 100)
  const formattedDate = moment(date).format('ddd MMM DD')
  const formattedTime = moment(time, 'h:mm').format('hh:mma')

  if (index === arrSize - 1) {
    return (
      <div>
        <button className={styles.wrapper} onClick={moreDatesOnClick}>
          <span className={styles.moreDates}>More </span>
          <span className={styles.moreDates}>dates</span>
        </button>
      </div>
    )
  }
  return (
    <div>
      <button className={styles.box} onClick={onClick}>
        <span className={styles.date}>{formattedDate}</span>
        <span className={styles.time}>{formattedTime}</span>
        <span className={styles.price}>{formattedPrice}</span>
      </button>
    </div>
  )
}
