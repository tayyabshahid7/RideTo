import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import styles from './styles.scss'
import classnames from 'classnames'
import { matchPath } from 'react-router'

const RightPanel = ({ children, history, location, type }) => {
  const myRef = useRef(null)

  history.listen((location, action) => {
    if (myRef.current) {
      myRef.current.scrollTop = 0
    }
  })

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
      ref={myRef}
      className={classnames(
        styles.rightPanel,
        type === 'full' && styles.fullPanel
      )}>
      {children}
    </div>
  )
}

export default withRouter(RightPanel)
