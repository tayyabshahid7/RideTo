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

  if (camelStatus === 'start') {
    return (
      <img
        className={styles.endIcon}
        src={start}
        alt="Start icon"
        onClick={() => {
          handleCompletedClick(id, false)
        }}
      />
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
        handleCompletedClick(id, false)
      }}
      className={classnames(
        styles.ring,
        styles[camelStatus],
        transparent && styles.ringTransparent,
        pulsate && styles.ringPulsate
      )}>
      {camelStatus === 'completed' && (
        <span key={`${id}-${camelStatus}`} className={styles.tick}>
          <i className="fa fa-check" />
        </span>
      )}
    </button>
  )
}

export default StatusIcon
