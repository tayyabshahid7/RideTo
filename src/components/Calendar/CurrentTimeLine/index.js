import React, { useState, useEffect } from 'react'
import styles from './index.scss'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { WEEK_START_HOUR } from 'common/constants'

const CurrentTimeLine = day => {
  const [top, setTop] = useState(0)
  let timerInstance = null

  const calcTime = () => {
    const time = momentTz().tz('Europe/London')
    const hours = time.hours() + time.minutes() / 60
    setTop((hours - WEEK_START_HOUR) * 56 + 'px')
  }

  useEffect(() => {
    calcTime()

    timerInstance = setTimeout(() => {
      calcTime()
    }, 60000)
  }, [])

  const isToday = moment().isSame(day.day.date, 'day')
  if (!isToday) {
    clearTimeout(timerInstance)
    return null
  }

  return <div className={styles.container} style={{ top }}></div>
}

export default CurrentTimeLine
