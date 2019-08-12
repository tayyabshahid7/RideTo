import React, { useRef, createRef, useEffect, useState } from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'

const reduceSteps = steps => {
  return steps.reduce((acc, step) => {
    if (['NEXT_STEP_CBT'].includes(step.id)) {
      const bookedStatus = steps.find(
        step => step.id === 'NEXT_STEP_CBT_BOOKED'
      ).status
      const postStatus = steps.find(step => step.id === 'NEXT_STEP_POST_CBT')
        .status

      acc.push({
        ...step,
        ...(['Next Step', 'Completed'].includes(bookedStatus) && {
          status: bookedStatus
        }),
        ...(['Next Step', 'Completed'].includes(postStatus) && {
          status: postStatus
        })
      })
    }

    if (
      !['NEXT_STEP_CBT', 'NEXT_STEP_CBT_BOOKED', 'NEXT_STEP_POST_CBT'].includes(
        step.id
      )
    ) {
      acc.push(step)
    }

    return acc
  }, [])
}

function Steps({ steps, percentComplete, handleCompletedClick }) {
  const reducedSteps = reduceSteps(steps)
  let completed = false
  let currentStep = reducedSteps.findIndex(step => {
    return step.status === 'Next Step'
  })
  if (currentStep === -1) {
    completed = true
    currentStep = reducedSteps.length - 1
  }
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const stepRefs = useRef(reducedSteps.map(() => createRef()))
  const currentStepRef = useRef(null)
  const [progressWidth, setProgressWidth] = useState(0)

  const handleResize = () => {
    const currentStepOffset = currentStepRef.current.offsetLeft
    setProgressWidth(currentStepOffset)
  }

  useEffect(() => {
    currentStepRef.current = stepRefs.current[currentStep].current
    handleResize()
  }, [currentStep, reducedSteps])

  useEffect(() => {
    stepRefs.current = reducedSteps.map(() => createRef())
  }, [reducedSteps])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener(('resize', handleResize))
  }, [])

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {reducedSteps.map((step, i) => (
          <Step
            handleCompletedClick={handleCompletedClick}
            ref={stepRefs.current[i]}
            key={i}
            step={step}
          />
        ))}
      </ul>
      {isDesktop && (
        <ProgressBar
          width={!completed && progressWidth}
          parcent={completed && 100}
          bgColor="#d8d8d8"
          className={styles.stepsBar}
        />
      )}
    </div>
  )
}

export default Steps
