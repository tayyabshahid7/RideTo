import React from 'react'
import styles from './styles.scss'
import { camelCase } from 'lodash'
import classnames from 'classnames'
import finish from './finish.svg'
import start from './start.svg'

function StatusIcon({ status, transparent, pulsate }) {
  const camelStatus = camelCase(status)

  if (camelStatus === 'start') {
    return <img className={styles.endIcon} src={start} alt="Start icon" />
  }

  if (camelStatus === 'ride') {
    return <img className={styles.endIcon} src={finish} alt="Finish icon" />
  }

  return (
    <div
      className={classnames(
        styles.ring,
        styles[camelStatus],
        transparent && styles.ringTransparent,
        pulsate && styles.ringPulsate
      )}>
      {camelStatus === 'complete' && (
        <span className={styles.tick}>
          <i className="fa fa-check" />
        </span>
      )}
    </div>
  )
}

export default StatusIcon
