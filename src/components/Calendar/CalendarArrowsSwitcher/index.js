import React from 'react'
import { Desktop } from 'common/breakpoints'
import styles from './styles.scss'

function CalendarArrowsSwitcher({ handleCustomEvent }) {
  return (
    <div className={styles.container}>
      <button className={styles.prev} onClick={() => handleCustomEvent('prev')}>
        <i className="fa fa-angle-left" />
      </button>
      <Desktop>
        <button
          className={styles.today}
          onClick={() => handleCustomEvent('today')}>
          Today
        </button>
      </Desktop>
      <button className={styles.next} onClick={() => handleCustomEvent('next')}>
        <i className="fa fa-angle-right" />
      </button>
    </div>
  )
}

export default CalendarArrowsSwitcher
