import React, { useState, useImperativeHandle, forwardRef } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

const ActionThreeDot = forwardRef((props, ref) => {
  const { down, children } = props
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    hideMenu() {
      setShow(false)
    }
  }))

  return (
    <div className={styles.container}>
      <div className={styles.trigger} onClick={() => setShow(true)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {show && (
        <React.Fragment>
          <div className={styles.backdrop} onClick={() => setShow(false)}></div>
          <div className={classnames(styles.dropdown, down && styles.showUp)}>
            {children}
          </div>
        </React.Fragment>
      )}
    </div>
  )
})

export default ActionThreeDot
