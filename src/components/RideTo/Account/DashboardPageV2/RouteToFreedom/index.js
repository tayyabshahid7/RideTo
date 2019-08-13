import React from 'react'
import styles from './styles.scss'
import Expander from './Expander'
import Steps from './Steps'
import Select from 'components/RideTo/Select'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import PercentCircle from './PercentCircle'
import { GOALS, STYLES } from './constants'

function RouteToFreedom({
  nextSteps,
  selectedGoal,
  selectedStyle,
  handleGoalChange,
  handleStyleChange,
  handleCompletedClick
}) {
  const stepsLength = nextSteps.length
  const currentStep = nextSteps.findIndex(step => step.status === 'Next Step')
  let percentComplete = Math.round((currentStep / stepsLength) * 100)
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  if (percentComplete < 0) {
    percentComplete = 100
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h1 className={styles.title}>Your route to freedom</h1>
          <Expander
            title="My goal"
            className={styles.filters}
            contentClassName={styles.filtersContent}
            selectedGoal={selectedGoal}
            selectedStyle={selectedStyle}
            summary>
            <div className={styles.formGroup}>
              <Select
                value={selectedGoal.constant}
                onChange={handleGoalChange}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Goal">
                {GOALS.map(goal => (
                  <option value={goal.constant} key={goal.constant}>
                    {goal.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className={styles.formGroup}>
              <Select
                value={selectedStyle.constant}
                onChange={handleStyleChange}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Style">
                {STYLES.map(style => (
                  <option value={style.constant} key={style.constant}>
                    {style.title}
                  </option>
                ))}
              </Select>
            </div>
          </Expander>
        </div>
        {isDesktop && <PercentCircle percentComplete={percentComplete} />}
      </div>
      <Expander
        title={`${percentComplete}% complete`}
        percentComplete={!isDesktop && percentComplete}>
        <Steps
          steps={nextSteps}
          percentComplete={percentComplete}
          handleCompletedClick={handleCompletedClick}
        />
      </Expander>
    </div>
  )
}

export default RouteToFreedom
