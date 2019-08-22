import React, { useState } from 'react'
import styles from './styles.scss'
import Expand from 'assets/images/rideto/Expand.svg'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import ProgressBar from '../ProgressBar'
import Summary from '../Summary'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'

function Expander({
  children,
  title,
  percentComplete,
  className,
  contentClassName,
  summary,
  selectedGoal,
  selectedStyle
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1025 })

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
      {(isOpen || isDesktop) && (
        <div className={classnames(styles.content, contentClassName)}>
          {children}
        </div>
      )}
      {summary && !isOpen && !isDesktop && (
        <Summary selectedGoal={selectedGoal} selectedStyle={selectedStyle} />
      )}
    </div>
  )
}

export default Expander
