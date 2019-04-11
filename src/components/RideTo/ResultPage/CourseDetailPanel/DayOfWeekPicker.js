import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

class DayOfWeekPicker extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { isWidget } = this.props

    return (
      <Fragment>
        <div className={styles.subtitle1}>Select a package</div>
        <p
          className={classnames(
            styles.dasInfo,
            isWidget && styles.dasInfoWidget
          )}>
          Select the times which you can train on, the more flexible, the sooner
          you can train
        </p>
      </Fragment>
    )
  }
}

export default DayOfWeekPicker
