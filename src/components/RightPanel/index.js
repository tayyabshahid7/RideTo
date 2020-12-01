import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { matchPath } from 'react-router'

function RightPanel({ children, location, type }) {
  const hasMatchingRoute = children.some(({ props: { exact, path } }) =>
    matchPath(location.pathname, {
      exact,
      path
    })
  )

  if (!hasMatchingRoute) {
    return null
  }

  return (
    <div
      className={classnames(
        styles.rightPanel,
        type === 'full' && styles.fullPanel
      )}>
      {children}
    </div>
  )
}

export default RightPanel
