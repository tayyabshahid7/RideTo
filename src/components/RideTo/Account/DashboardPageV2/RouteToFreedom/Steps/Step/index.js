import React from 'react'
import styles from './styles.scss'
import StatusIcon from '../../../StatusIcon'

function Step({ step: { name, status } }) {
  const visualStatus = ['Start', 'Ride', 'Not Started'].includes(status)
    ? '–'
    : status

  return (
    <li className={styles.item}>
      <span className={styles.main}>
        <StatusIcon status={status} />
        <span className={styles.name}>{name}</span>
      </span>{' '}
      <span className={styles.status}>{visualStatus}</span>
    </li>
  )
}

export default Step
