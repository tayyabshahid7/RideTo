import React from 'react'
import styles from './styles.scss'

function Summary({ selectedGoal, selectedStyle }) {
  return (
    <ul className={styles.list}>
      <li>
        Goal <span>{selectedGoal}</span>
      </li>
      <li>
        Style <span>{selectedStyle}</span>
      </li>
    </ul>
  )
}

export default Summary
