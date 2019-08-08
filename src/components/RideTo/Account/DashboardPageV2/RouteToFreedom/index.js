import React from 'react'
import styles from './styles.scss'
import Expander from './Expander'
import Steps from './Steps'
import Select from 'components/RideTo/Select'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import PercentCircle from './PercentCircle'

const STEPS = [
  {
    name: 'Start',
    status: 'Start'
  },
  {
    name: 'Licence',
    status: 'Complete'
  },
  {
    name: 'ITM',
    status: 'Complete'
  },
  {
    name: 'Revise',
    status: 'Complete'
  },
  {
    name: 'CBT',
    status: 'Complete'
  },
  {
    name: 'Theory Test',
    status: 'Next Step'
  },
  {
    name: 'Full Licence',
    status: 'Not Started'
  },
  {
    name: 'Bike',
    status: 'Not Started'
  },
  {
    name: 'Insure',
    status: 'Not Started'
  },
  {
    name: 'Ride',
    status: 'Ride'
  }
]

function RouteToFreedom() {
  const stepsLength = STEPS.length
  const currentStepIndex = STEPS.findIndex(step => step.status === 'Next Step')
  const percentComplete = (currentStepIndex / stepsLength) * 100
  const goal = 'Asdf'
  const style = 'Asdf'
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h1 className={styles.title}>Your route to freedom</h1>
          <Expander
            title="My goal"
            className={styles.filters}
            contentClassName={styles.filtersContent}>
            <div className={styles.formGroup}>
              <Select
                value={goal}
                onChange={event => console.log(event)}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Goal">
                <option>Asdf</option>
                <option>Asdf</option>
                <option>Asdf</option>
              </Select>
            </div>
            <div className={styles.formGroup}>
              <Select
                value={style}
                onChange={event => console.log(event)}
                className={classnames(styles.input, styles.inputSelect)}
                label="My Riding Style">
                <option>Asdf</option>
                <option>Asdf</option>
                <option>Asdf</option>
              </Select>
            </div>
          </Expander>
        </div>
        {isDesktop && <PercentCircle percentComplete={percentComplete} />}
      </div>
      <Expander
        title={`${percentComplete}% complete`}
        percentComplete={!isDesktop && percentComplete}>
        <Steps steps={STEPS} percentComplete={percentComplete} />
      </Expander>
    </div>
  )
}

export default RouteToFreedom
