import React, {
  useRef,
  createRef,
  useEffect,
  useState,
  useCallback
} from 'react'
import styles from './styles.scss'
import Step from './Step'
import ProgressBar from '../ProgressBar'
import { useMediaQuery } from 'react-responsive'
import { range } from 'lodash'
import { findLastStepIndex } from '../util'

function Steps({
  steps,
  percentComplete,
  handleCompletedClick,
  handlePreviewClick,
  skipItm
}) {
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const currentStepIndex = findLastStepIndex(steps, skipItm)
  const stepRefs = useRef(range(steps.length).map(() => createRef()))
  const currentStepRef = useRef(null)
  const [progress, setProgress] = useState(0)

  const handleResize = useCallback(() => {
    const { current } = currentStepRef
    const currentStepOffset = current[isDesktop ? 'offsetLeft' : 'offsetTop']

    setProgress(currentStepOffset)
  }, [isDesktop])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    currentStepRef.current = stepRefs.current[currentStepIndex].current
    handleResize()
  }, [currentStepIndex, steps, handleResize])

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {steps.map((step, i) => (
          <Step
            isNextStep={currentStepIndex === i && step.status !== 'Ride'}
            handleCompletedClick={handleCompletedClick}
            handlePreviewClick={handlePreviewClick}
            ref={stepRefs.current[i]}
            key={i}
            step={step}
          />
        ))}
      </ul>
      <ProgressBar
        measurement={progress}
        percent={percentComplete === 100 ? percentComplete : undefined}
        bgColor="#d8d8d8"
        className={styles.stepsBar}
        direction={isDesktop ? 'horizontal' : 'vertical'}
      />
    </div>
  )
}

export default Steps
