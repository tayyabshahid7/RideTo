import React, { Fragment, useState } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

const QUESTIONS = [
  {
    id: 'old',
    name: 'How old are you?',
    options: ['17-18', '19-23', '24+']
  },
  {
    id: 'long',
    name: 'How long have you been riding?',
    options: ['Not stated', '0-3 Months', '3-6 Months', '6+ Months']
  },
  {
    id: 'miles',
    name: 'Miles ridden in the past 6 months?',
    options: ['None', 'Less than 500', '500-1,500', '1,500+']
  },
  {
    id: 'bike',
    name: 'What bike type was this on?',
    options: ['Manual', 'Automatic']
  },
  {
    id: 'size',
    name: 'What size bike was this on?',
    options: ['125cc', 'More than 125cc']
  }
]

function HelpForm({ isWidget }) {
  const [values, setValues] = useState({
    old: '',
    long: '',
    miles: '',
    bike: '',
    size: ''
  })
  const [cbtSelected, setCbtSelected] = useState(false)
  const [theorySelected, setTheorySelected] = useState(false)

  const handleInputChange = (name, value) => {
    setValues({ ...values, [name]: value })
  }

  const handleCheckboxClick = event => {
    const { checked, name } = event.target

    if (name === 'cbt') {
      setCbtSelected(checked)
    } else {
      setTheorySelected(checked)
    }
  }

  return (
    <Fragment>
      {QUESTIONS.map(({ id, name, options }, i) => (
        <div key={id} style={{ marginTop: '2rem' }}>
          <label className={styles.subtitle1}>
            <span className={styles.stepNumber}>{i + 2}</span> {name}
          </label>
          <div className={styles.bikeButtons} style={{ flexWrap: 'wrap' }}>
            {options.map(option => (
              <button
                key={option}
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  values[id] === option && styles.activeBtn
                )}
                onClick={() => {
                  handleInputChange(id, option)
                }}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: '2rem' }}>
        <label className={styles.subtitle1}>
          <span className={styles.stepNumber}>{QUESTIONS.length + 2}</span> What
          valid certificates do you have?
        </label>
        <div className={styles.helpFormChecks}>
          <label>
            <input
              type="checkbox"
              name="cbt"
              onClick={handleCheckboxClick}
              checked={cbtSelected}
            />{' '}
            Compulsory Basic Training
          </label>
          <label>
            <input
              type="checkbox"
              name="theory"
              onClick={handleCheckboxClick}
              checked={theorySelected}
            />{' '}
            Motorcyle Theory
          </label>
        </div>
        <div className={styles.bothRequired}>
          Both certificates are required in order to book
        </div>
      </div>
    </Fragment>
  )
}

export default HelpForm
