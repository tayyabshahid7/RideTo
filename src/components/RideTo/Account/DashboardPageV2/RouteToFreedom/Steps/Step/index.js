import React, { forwardRef } from 'react'
import styles from './styles.scss'
import StatusIcon from '../../../StatusIcon'

const Step = forwardRef(({ step: { name, status } }, ref) => {
  const visualStatus = ['Start', 'Ride', 'Not Started'].includes(status)
    ? '–'
    : status

  return (
    <li ref={ref} className={styles.item}>
      {status === 'Next Step' && (
        <span className={styles.nextStep}>Next Step</span>
      )}
      <span className={styles.main}>
        <StatusIcon status={status} />
        <span className={styles.name}>{name}</span>
      </span>{' '}
      <span className={styles.status}>{visualStatus}</span>
    </li>
  )
})

export default Step
