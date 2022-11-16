import React from 'react'
import styles from './styles.scss'

export default function MoreDatesBox({ moreDatesOnClick }) {
  return (
    <div className={styles.AvailableDateBoxDiv} onClick={moreDatesOnClick}>
      <button>
        <span>More</span>
        <span>dates</span>
      </button>
    </div>
  )
}
