import React from 'react'
import styles from './styles.scss'
import { camelCase } from 'lodash'
import classnames from 'classnames'
import finish from './finish.svg'
import start from './start.svg'

function StatusIcon({
  id,
  status,
  transparent,
  pulsate,
  handleCompletedClick
}) {
  const camelStatus = camelCase(status)
  const isCompleted = camelStatus === 'completed'

  if (camelStatus === 'start') {
    return (
      <button
        className={styles.iconButton}
        onClick={() => {
          handleCompletedClick(id)
        }}>
        <img className={styles.endIcon} src={start} alt="Start icon" />
      </button>
    )
  }

  if (camelStatus === 'ride') {
    return <img className={styles.endIcon} src={finish} alt="Finish icon" />
  }

  if (pulsate) {
    return (
      <div
        className={classnames(
          styles.ring,
          styles[camelStatus],
          transparent && styles.ringTransparent,
          styles.ringPulsate
        )}>
        {camelStatus === 'complete' && (
          <span key={`${id}-${camelStatus}`} className={styles.tick}>
            <i className="fa fa-check" />
          </span>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        handleCompletedClick(id, !isCompleted)
      }}
      className={classnames(
        styles.ring,
        styles[camelStatus],
        transparent && styles.ringTransparent,
        pulsate && styles.ringPulsate
      )}>
      {isCompleted && (
        <span key={`${id}-${camelStatus}`} className={styles.tick}>
          <i className="fa fa-check" />
        </span>
      )}
    </button>
  )
}

export default StatusIcon
