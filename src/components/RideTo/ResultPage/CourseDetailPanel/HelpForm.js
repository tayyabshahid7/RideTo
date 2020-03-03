import React, { Fragment, useState, useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getDefaultFullLicencePackage } from 'services/course'
import { flashDiv } from 'services/page'
import { parseQueryString } from 'services/api'
import { normalizePostCode } from 'utils/helper'

const QUESTIONS = [
  {
    id: 'old',
    name: 'How old are you?',
    options: ['17-18', '19-23', '24+']
  },
  {
    id: 'long',
    name: 'How long have you been riding?',
    options: ['Not started', '0-3 Months', '3-6 Months', '6+ Months']
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

function HelpForm({ isWidget, onUpdate, updateContainerState, isErrored }) {
  const [values, setValues] = useState({
    old: '',
    long: '',
    miles: '',
    bike: '',
    size: ''
  })
  const [cbtSelected, setCbtSelected] = useState(false)
  const [theorySelected, setTheorySelected] = useState(false)
  const [showCBTLink, setShowCBTLink] = useState(false)

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

  useEffect(() => {
    // if (!cbtSelected || !theorySelected) {
    if (!cbtSelected) {
      updateContainerState({
        formCompleted: false
      })
      onUpdate({
        bike_hire: null,
        selectedLicenceType: null,
        selectedPackageHours: null,
        formCompletedWithoutTheory: false
      })
      return
    }

    setShowCBTLink(false)

    if (!Object.values(values).every(Boolean)) {
      return
    }

    const [bikeHire, licenceType, packageHours] = getDefaultFullLicencePackage(
      values
    )

    updateContainerState({
      formCompleted: true
    })
    onUpdate({
      bike_hire: bikeHire,
      selectedLicenceType: licenceType,
      selectedPackageHours: packageHours,
      formCompletedWithoutTheory: !theorySelected
    })
    // eslint-disable-next-line
  }, [values, cbtSelected, theorySelected])

  useEffect(() => {
    if (isErrored) {
      Object.entries(values).forEach(([key, value]) => {
        if (!value) {
          flashDiv(`choose-quiz-${key}`)
        }
      })
      if (cbtSelected) {
        setShowCBTLink(false)
      } else {
        setShowCBTLink(true)
        flashDiv('choose-cbt')
      }
      // if (!theorySelected) {
      //   flashDiv('choose-both')
      // }
    }
    // eslint-disable-next-line
  }, [isErrored])

  return (
    <Fragment>
      {QUESTIONS.filter((question, i) => {
        if (values.long === 'Not started' && i > 1) {
          return false
        }
        return true
      }).map(({ id, name, options }, i) => (
        <div id={`choose-quiz-${id}`} key={id} style={{ marginTop: '24px' }}>
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
                style={{
                  marginTop: '2%'
                }}
                onClick={() => {
                  handleInputChange(id, option)
                }}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      {values.long !== 'Not started' ? (
        <div style={{ marginTop: '24px' }}>
          <label className={styles.subtitle1}>
            <span className={styles.stepNumber}>{QUESTIONS.length + 2}</span>{' '}
            What valid certificates do you have?
          </label>
          <div className={styles.helpFormChecks}>
            <label>
              <input
                type="checkbox"
                name="cbt"
                onChange={handleCheckboxClick}
                checked={cbtSelected}
              />{' '}
              Compulsory Basic Training
            </label>
            <label>
              <input
                type="checkbox"
                name="theory"
                onChange={handleCheckboxClick}
                checked={theorySelected}
              />{' '}
              Motorcycle Theory
            </label>
          </div>
          {/*
          <div id="choose-both" className={styles.bothRequired}>
            Both certificates are required in order to book
          </div>
        */}
          {showCBTLink && (
            <div
              id="choose-cbt"
              className={classnames(styles.cbtRequired, 'highlight-required')}>
              You first need to complete the CBT course.{' '}
              <a
                href={`/course-location/?postcode=${normalizePostCode(
                  parseQueryString(window.location.search.slice(1)).postcode
                )}&courseType=LICENCE_CBT`}>
                View CBT courses
              </a>
              .
            </div>
          )}
        </div>
      ) : (
        <p style={{ marginTop: '1rem', marginBottom: '-0.5rem' }}>
          If you're new to riding and yet to get on a bike, you'll need to start
          with the CBT course.
        </p>
      )}
    </Fragment>
  )
}

export default HelpForm
