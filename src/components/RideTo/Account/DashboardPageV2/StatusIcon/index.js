import React from 'react'
import styles from './styles.scss'
import { camelCase } from 'lodash'
import classnames from 'classnames'

function StatusIcon({ status }) {
  const camelStatus = camelCase(status)

  if (camelStatus === 'start') {
    return <div>F</div>
  }

  if (camelStatus === 'ride') {
    return <div>F</div>
  }

  return (
    <div className={classnames(styles.ring, styles[camelStatus])}>
      {camelStatus === 'complete' && (
        <span className={styles.tick}>
          <i className="fa fa-check" />
        </span>
      )}
    </div>
  )
}

export default StatusIcon
