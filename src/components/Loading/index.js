import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const Loading = props => {
  return (
    <div
      className={classnames(
        styles.loading,
        styles[props.position],
        props.loading && styles.loadingMask,
        props.resultsPage && styles.resultsPage,
        props.className
      )}>
      {props.children}
    </div>
  )
}

export default Loading
