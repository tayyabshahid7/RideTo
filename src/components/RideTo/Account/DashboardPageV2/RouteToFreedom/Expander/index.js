import React, { useState } from 'react'
import styles from './styles.scss'
import Expand from 'assets/images/rideto/Expand.svg'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import ProgressBar from '../ProgressBar'
import classnames from 'classnames'

function Expander({
  children,
  title,
  percentComplete,
  className,
  contentClassName
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={className}>
      <button className={styles.button} onClick={handleClick}>
        <h2>{title}</h2>
        <img
          className={styles.expandIcon}
          src={isOpen ? CloseDark : Expand}
          alt="Expand"
        />
      </button>
      {percentComplete && <ProgressBar percent={percentComplete} />}
      <div
        className={classnames(styles.content, contentClassName)}
        style={{ display: isOpen ? 'block' : undefined }}>
        {children}
      </div>
    </div>
  )
}

export default Expander
