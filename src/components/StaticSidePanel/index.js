import React from 'react'
import classnames from 'classnames'
import CloseButton from 'components/common/CloseButton'
import { Mobile } from 'common/breakpoints'

import styles from './styles.scss'

const StaticSidePanel = ({ children, show, onClose, title }) => {
  return (
    <div className={classnames(show && styles.show, styles.container)}>
      <Mobile>
        <div className={styles.header}>
          <label>{title}</label>
          <CloseButton onClick={onClose} />
        </div>
      </Mobile>
      {children}
    </div>
  )
}

export default StaticSidePanel
