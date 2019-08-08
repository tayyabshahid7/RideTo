import React from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'

function Steps({ steps, percentComplete }) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {steps.map(step => (
          <Step key={step.name} step={step} />
        ))}
      </ul>
      {isDesktop && (
        <ProgressBar
          percent={percentComplete}
          bgColor="#d8d8d8"
          className={styles.stepsBar}
        />
      )}
    </div>
  )
}

export default Steps
