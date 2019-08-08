import React, { useRef, createRef, useEffect, useState } from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'

function Steps({ steps, percentComplete, currentStep }) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const stepRefs = useRef(steps.map(() => createRef()))
  const currentStepRef = useRef(null)
  const [progressWidth, setProgressWidth] = useState(0)

  const handleResize = () => {
    const currentStepOffset = currentStepRef.current.offsetLeft
    setProgressWidth(currentStepOffset)
  }

  useEffect(() => {
    currentStepRef.current = stepRefs.current[currentStep].current
    handleResize()
  }, [currentStep])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener(('resize', handleResize))
  }, [])

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {steps.map((step, i) => (
          <Step ref={stepRefs.current[i]} key={step.name} step={step} />
        ))}
      </ul>
      {isDesktop && (
        <ProgressBar
          width={progressWidth}
          bgColor="#d8d8d8"
          className={styles.stepsBar}
        />
      )}
    </div>
  )
}

export default Steps
