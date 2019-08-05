import React from 'react'
import styles from './styles.scss'

function ProgressBar({ percent }) {
  return (
    <div className={styles.bar}>
      <div
        className={styles.progress}
        style={{
          width: `${percent}%`
        }}></div>
    </div>
  )
}

export default ProgressBar
