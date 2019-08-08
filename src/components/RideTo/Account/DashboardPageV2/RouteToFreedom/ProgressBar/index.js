import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function ProgressBar({ percent, bgColor, className }) {
  return (
    <div
      className={classnames(styles.bar, className)}
      style={{
        backgroundColor: bgColor
      }}>
      <div
        className={styles.progress}
        style={{
          width: `${percent}%`
        }}></div>
    </div>
  )
}

export default ProgressBar
