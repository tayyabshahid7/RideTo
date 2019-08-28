import React from 'react'
import Circle from 'react-circle'
import styles from './styles.scss'

function PercentCircle({ percentComplete }) {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <span className={styles.number}>{percentComplete}%</span>
        <span className={styles.complete}>Complete</span>
      </div>
      <Circle
        lineWidth={7}
        progress={percentComplete}
        roundedStrike={true}
        progressColor="var(--dashboard-green)"
        bgColor="var(--dark-color)"
        animate={false}
        responsive={true}
        showPercentage={false}
      />
    </div>
  )
}

export default PercentCircle
