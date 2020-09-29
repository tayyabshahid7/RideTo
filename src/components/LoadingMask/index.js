import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const Loading = ({ loading, className }) => {
  if (!loading) {
    return null
  }

  return <div className={classnames(styles.loading, className)}></div>
}

export default Loading
