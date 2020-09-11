import React from 'react'
import styles from './styles.scss'
import { matchPath } from 'react-router'

function RightPanel({ children, location }) {
  const hasMatchingRoute = children.some(({ props: { exact, path } }) =>
    matchPath(location.pathname, {
      exact,
      path
    })
  )

  if (!hasMatchingRoute) {
    return null
  }

  return <div className={styles.rightPanel}>{children}</div>
}

export default RightPanel
