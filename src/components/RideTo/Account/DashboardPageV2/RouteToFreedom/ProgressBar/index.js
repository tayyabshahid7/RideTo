import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function ProgressBar({ percent, width, bgColor, className }) {
  let cssWidth = null

  if (width) {
    cssWidth = `${width}px`
  }

  if (percent) {
    cssWidth = `${percent}%`
  }

  return (
    <div
      className={classnames(styles.bar, className)}
      style={{
        backgroundColor: bgColor
      }}>
      <div
        className={styles.progress}
        style={{
          width: cssWidth
        }}></div>
    </div>
  )
}

export default ProgressBar
