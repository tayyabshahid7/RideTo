import React, { useState } from 'react'
import styles from './styles.scss'
import Expander from './Expander'
import Steps from './Steps'
import Select from 'components/RideTo/Select'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import PercentCircle from './PercentCircle'
import { GOALS, STYLES } from './content'

function RouteToFreedom({ nextSteps }) {
  // const stepNames = uniqBy(nextSteps, 'name')
  const stepsLength = nextSteps.length
  const currentStep = nextSteps.findIndex(step => step.status === 'Next Step')
  const percentComplete = Math.round((currentStep / stepsLength) * 100)
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0])
  const [selectedStyle, setselectedStyle] = useState(STYLES[0])
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  const handleGoalChange = event => {
    setSelectedGoal(event.target.value)
  }

  const handleStyleChange = event => {
    setselectedStyle(event.target.value)
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
                value={selectedGoal}
                onChange={handleGoalChange}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Goal">
                {GOALS.map(goal => (
                  <option key={goal}>{goal}</option>
                ))}
              </Select>
            </div>
            <div className={styles.formGroup}>
              <Select
                value={selectedStyle}
                onChange={handleStyleChange}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Style">
                {STYLES.map(style => (
                  <option key={style}>{style}</option>
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
          currentStep={currentStep}
        />
      </Expander>
    </div>
  )
}

export default RouteToFreedom
