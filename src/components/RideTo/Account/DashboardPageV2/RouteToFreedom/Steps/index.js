import React, { useRef, createRef, useEffect, useState } from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'

function Steps({ steps, percentComplete, currentStep }) {
  const reducedSteps = steps.reduce((acc, step) => {
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
  }, [currentStep])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener(('resize', handleResize))
  }, [])

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {reducedSteps.map((step, i) => (
          <Step ref={stepRefs.current[i]} key={i} step={step} />
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
