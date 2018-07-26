import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const Loading = props => {
  return (
    <div className={classnames(props.loading && styles.loadingMask)}>
      {props.children}
    </div>
  )
}

export default Loading
