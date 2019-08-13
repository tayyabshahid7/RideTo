import React, { useRef, createRef, useEffect, useState } from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'
import { range } from 'lodash'

function Steps({ steps, percentComplete, handleCompletedClick }) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  console.log(steps)
  const currentStepIndex = steps.findIndex(
    step => step.status === 'Not Started'
  )
  const stepRefs = useRef(range(steps.length).map(() => createRef()))
  const currentStepRef = useRef(null)
  const [progressWidth, setProgressWidth] = useState(0)

  const handleResize = () => {
    const currentStepOffset = currentStepRef.current.offsetLeft
    setProgressWidth(currentStepOffset)
  }

  useEffect(() => {
    currentStepRef.current = stepRefs.current[currentStepIndex].current
    handleResize()
  }, [currentStepIndex, steps])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener(('resize', handleResize))
  }, [])

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {steps.map((step, i) => (
          <Step
            isNextStep={currentStepIndex === i}
            handleCompletedClick={handleCompletedClick}
            ref={stepRefs.current[i]}
            key={i}
            step={step}
          />
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
