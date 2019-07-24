import React, { useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { flashDiv } from 'services/page'

const ToggleQuiz = React.forwardRef(
  ({ isWidget, updateState, needsHelp, onUpdate, isErrored }, ref) => {
    useEffect(() => {
      if (isErrored && needsHelp === null) {
        flashDiv('choose-quiz')
      }
    }, [isErrored, needsHelp])

    return (
      <div className={styles.bikeHireWrapper} ref={ref}>
        <label id="choose-quiz" className={styles.subtitle1}>
          <span className={styles.stepNumber}>1</span> Do you need help finding
          a course?
        </label>

        <div className={styles.bikeButtons}>
          <button
            className={classnames(
              styles.bikeHireBtn,
              isWidget && styles.widgetBtn,
              needsHelp === true && styles.activeBtn
            )}
            onClick={() => {
              updateState({
                needsHelp: true
              })
              onUpdate({
                bike_hire: null,
                selectedLicenceType: null,
                selectedPackageHours: null,
                isErrored: false,
                formCompletedWithoutTheory: false
              })
            }}>
            Yes
          </button>
          <button
            className={classnames(
              styles.bikeHireBtn,
              isWidget && styles.widgetBtn,
              needsHelp === false && styles.activeBtn
            )}
            onClick={() => {
              updateState({
                needsHelp: false
              })
              onUpdate({
                bike_hire: null,
                selectedLicenceType: null,
                selectedPackageHours: null,
                isErrored: false,
                formCompletedWithoutTheory: false
              })
            }}>
            No
          </button>
        </div>
      </div>
    )
  }
)

export default ToggleQuiz
