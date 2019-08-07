import React, { useState } from 'react'
import styles from './styles.scss'
import Expand from 'assets/images/rideto/Expand.svg'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import ProgressBar from '../ProgressBar'

function Expander({ children, title, percentComplete }) {
  // const [isOpen, setIsOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
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
        className={styles.content}
        style={{ display: isOpen ? 'block' : undefined }}>
        {children}
      </div>
    </div>
  )
}

export default Expander
