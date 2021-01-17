import React from 'react'
import styles from './styles.scss'

function PeaceOfMindPolicyInfo() {
  return (
    <div className={styles.container}>
      <span>!</span>
      <div className={styles.popover}>
        The Peace of Mind Policy is a unique offer from RideTo to pay for a 2nd
        day of training to complete your CBT (if needed).
        <br /> We highly recommend this option for new and nervous riders.
        Without the Peace of Mind Policy, any further training will need to be
        paid at the standard rate.
      </div>
    </div>
  )
}

export default PeaceOfMindPolicyInfo
