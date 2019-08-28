import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function ProgressBar({
  percent,
  measurement,
  bgColor,
  className,
  direction = 'horizontal'
}) {
  let cssWidth = null
  let cssHeight = null

  if (direction === 'horizontal') {
    if (measurement) {
      cssWidth = `${measurement}px`
    }

    if (percent) {
      cssWidth = `${percent}%`
    }
  }

  if (direction === 'vertical') {
    if (measurement) {
      cssHeight = `${measurement}px`
    }

    if (percent) {
      cssHeight = `${percent}%`
    }
  }

  return (
    <div
      className={classnames(styles.bar, styles[direction], className)}
      style={{
        backgroundColor: bgColor
      }}>
      <div
        className={styles.progress}
        style={{
          width: cssWidth,
          height: cssHeight
        }}></div>
    </div>
  )
}

export default ProgressBar
