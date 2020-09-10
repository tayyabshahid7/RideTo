import React, { useEffect } from 'react'
import styles from './styles.scss'
import { matchPath } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleSidePanel } from 'store/calendar'

function RightPanel({ children, location, toggleSidePanel }) {
  useEffect(() => {
    toggleSidePanel(true)

    return () => toggleSidePanel(false)
  }, [])

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

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleSidePanel
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightPanel)
