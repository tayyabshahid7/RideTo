import React from 'react'
import styles from './styles.scss'
import Step from './Step'

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

function Steps() {
  return (
    <ul className={styles.list}>
      {STEPS.map(step => (
        <Step key={step.name} step={step} />
      ))}
    </ul>
  )
}

export default Steps
