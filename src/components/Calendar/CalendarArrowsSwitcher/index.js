import React from 'react'
import styles from './styles.scss'
import { useMediaQuery } from 'react-responsive'
import CalendarDateChanger from '../CalendarDateChanger'

function CalendarArrowsSwitcher({
  handleCustomEvent,
  calendar,
  handleChangeDate
}) {
  const isDesktop = useMediaQuery({ minWidth: 768 })

  return (
    <div className={styles.container}>
      <button className={styles.prev} onClick={() => handleCustomEvent('prev')}>
        <i className="fa fa-angle-left" />
      </button>
      {isDesktop ? (
        <button
          className={styles.today}
          onClick={() => handleCustomEvent('today')}>
          Today
        </button>
      ) : (
        <CalendarDateChanger
          calendar={calendar}
          handleChangeDate={handleChangeDate}
          showYears={false}
        />
      )}
      <button className={styles.next} onClick={() => handleCustomEvent('next')}>
        <i className="fa fa-angle-right" />
      </button>
    </div>
  )
}

export default CalendarArrowsSwitcher
