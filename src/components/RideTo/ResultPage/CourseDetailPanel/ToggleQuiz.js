import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const ToggleQuiz = React.forwardRef(
  ({ isWidget, updateState, needsHelp }, ref) => {
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
            }}>
            No
          </button>
        </div>
      </div>
    )
  }
)

export default ToggleQuiz
