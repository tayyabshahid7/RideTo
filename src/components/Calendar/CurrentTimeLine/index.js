import React, { useState, useEffect } from 'react'
import styles from './index.scss'
import moment from 'moment'

const CurrentTimeLine = day => {
  const [top, setTop] = useState(0)
  let timerInstance = null

  const calcTime = () => {
    const seconds = new Date().getTime() % (24 * 60 * 60 * 1000)
    setTop((parseFloat(seconds) / (24 * 60 * 60 * 1000)) * 1200 + 'px')
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
