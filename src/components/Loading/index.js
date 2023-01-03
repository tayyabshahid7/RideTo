import classnames from 'classnames'
import React from 'react'
import styles from './styles.scss'

const Loading = props => {
  return (
    <div
      className={classnames(
        styles.loading,
        styles[props.position],
        props.loading && styles.loadingMask,
        props.cover && styles.cover,
        props.className
      )}>
      {props.children}
    </div>
  )
}

export default Loading
