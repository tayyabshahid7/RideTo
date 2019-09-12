import React from 'react'
import Circle from 'react-circle'
import styles from './styles.scss'
import classnames from 'classnames'

function RideToScore({ score, small = false }) {
  return (
    <div className={styles.score}>
      <div className={classnames(small && styles.smallTitle)}>RideTo Score</div>
      <div className={classnames(styles.circle, small && styles.smallCircle)}>
        <span className={styles.scoreNum}>{Math.round(score) / 10}/10</span>
        <Circle
          progress={score}
          roundedStrike={true}
          progressColor="green"
          animate={false}
          responsive={true}
          showPercentage={false}
        />
      </div>
    </div>
  )
}

export default RideToScore
