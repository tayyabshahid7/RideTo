import React, { forwardRef } from 'react'
import styles from './styles.scss'
import StatusIcon from '../../../StatusIcon'

const Step = forwardRef(
  ({ step, handleCompletedClick, handlePreviewClick, isNextStep }, ref) => {
    const { name, status, constant } = step
    const visualStatus = ['Start', 'Ride', 'Not Started'].includes(status)
      ? '–'
      : status

    return (
      <li ref={ref} className={styles.item}>
        {isNextStep && <span className={styles.nextStep}>Next Step</span>}
        <span className={styles.main}>
          <StatusIcon
            id={constant}
            status={isNextStep ? 'Next Step' : status}
            handleCompletedClick={handleCompletedClick}
          />
          {constant === 'STEP_START' ? (
            <span className={styles.name}>{name}</span>
          ) : (
            <button
              className={styles.name}
              onClick={() => {
                handlePreviewClick(constant)
              }}>
              {name}
            </button>
          )}
        </span>{' '}
        <span className={styles.status}>{visualStatus}</span>
      </li>
    )
  }
)

export default Step
