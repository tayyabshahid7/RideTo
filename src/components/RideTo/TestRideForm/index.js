import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import rangeInclusive from 'range-inclusive'
import { getParam } from 'utils/helper'
import { fetchBike, mapBike } from 'services/bike-sales'
import Input from './Input'
import { capitalizeFirstLetter } from 'utils/helper'
import { post } from 'services/api'
import Loading from 'components/Loading'

const STEPS = [
  {
    id: 1,
    name: 'location',
    title: "What's your post code?",
    icon: 'map-marker-alt',
    placeholder: 'Postcode'
  },
  {
    id: 2,
    name: 'licence',
    title: 'What licence do you have?',
    icon: 'id-badge',
    placeholder: 'Current licence'
  },
  {
    id: 3,
    name: 'date',
    title: 'When do you want to see the bike',
    icon: 'calendar-alt',
    placeholder: 'Choose date'
  },

  {
    id: 4,
    name: 'email',
    title: 'Ready to book your test ride?',
    desc:
      'Enter your email and we’ll send you times to view the bike at a local dealer',
    terms: 'By clicking the button you agree to our T&Cs and Privacy policy.',
    icon: 'at',
    placeholder: 'Enter email'
  }
]

class TestRideForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      step: 1,
      bike: null,
      location: '',
      licence: '',
      date: '',
      email: '',
      time: '',
      showInitialBack: true
    }

    this.submitForm = this.submitForm.bind(this)
    this.handleBackClick = this.handleBackClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRadioClick = this.handleRadioClick.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  async componentDidMount() {
    const id = getParam(window.location.search, 'id')

    if (!id) {
      window.location.replace('/bike-reviews')
    }

    try {
      const domain = window.location.hostname
      const refDomain = new URL(document.referrer).hostname

      if (domain !== refDomain) {
        this.setState({
          showInitialBack: false
        })
      }
    } catch {
      this.setState({
        showInitialBack: false
      })
    }

    const bike = await fetchBike(id)

    this.setState({
      bike: mapBike(bike)
    })
  }

  async submitForm() {
    const {
      bike: { name },
      location,
      licence,
      date,
      email,
      time
    } = this.state
    const data = {
      email,
      bike: name,
      postcode: location,
      current_licence: licence,
      date,
      period: time
    }
    const path = `bike-reviews/new-message`

    this.setState({
      loading: true
    })

    try {
      await post(path, data)

      this.setState({
        loading: false,
        submitted: true
      })
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message
      })
    }
  }

  handleFormSubmit(event) {
    const { step } = this.state

    event.preventDefault()

    if (step === 4) {
      this.submitForm()
    } else {
      this.setState({
        step: step + 1
      })
    }
  }

  handleInputChange({ target: { name, value } }) {
    this.setState({
      [name]: value
    })
  }

  handleRadioClick({ target: { name, value, checked } }) {
    this.setState({
      time: value
    })
  }

  handleBackClick() {
    const { step } = this.state

    if (step === 1) {
      window.history.back()
    } else {
      this.setState({
        step: step - 1
      })
    }
  }

  render() {
    if (!this.state.bike) {
      return null
    }

    const {
      step,
      bike: { name: bikeName },
      time,
      loading,
      error,
      submitted,
      showInitialBack
    } = this.state
    const { name, title, desc, terms, icon, placeholder } = STEPS.find(
      ({ id }) => id === step
    )

    return (
      <div className={styles.page}>
        <Loading loading={loading} className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{bikeName} Test Ride</h1>
            <div className={styles.steps}>
              <div>
                Step {step}/4: {capitalizeFirstLetter(name)}
              </div>
              <ol className={styles.stepsList}>
                {rangeInclusive(4).map(i => (
                  <li className={i <= step ? styles.active : undefined} key={i}>
                    Step {i}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <form className={styles.main} onSubmit={this.handleFormSubmit}>
            <h2 className={styles.formTitle}>
              {submitted ? (
                <Fragment>
                  Request sent
                  <br />
                  <span className={styles.check}>
                    <i className="fas fa-check" />
                  </span>
                </Fragment>
              ) : (
                title
              )}
            </h2>
            {!submitted && (
              <Fragment>
                {' '}
                {desc && <p className={styles.desc}>{desc}</p>}
                <Input
                  icon={icon}
                  name={name}
                  value={this.state[name]}
                  onChange={this.handleInputChange}
                  placeholder={placeholder}
                />
                {name === 'date' && (
                  <div className={styles.radios}>
                    <label className={styles.radio}>
                      <input
                        required
                        checked={time === 'am'}
                        type="radio"
                        name="time"
                        value="am"
                        onChange={this.handleRadioClick}
                      />{' '}
                      <span>AM</span>
                    </label>
                    <label className={styles.radio}>
                      <input
                        required
                        checked={time === 'pm'}
                        type="radio"
                        name="time"
                        value="pm"
                        onChange={this.handleRadioClick}
                      />{' '}
                      <span>PM</span>
                    </label>
                  </div>
                )}
                <button className={styles.nextButton}>
                  {step < 4 ? 'Next' : 'Book test ride'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
                {terms && <p className={styles.terms}>{terms}</p>}
              </Fragment>
            )}
          </form>
          <div className={styles.footer}>
            {!submitted && !(step === 1 && !showInitialBack) && (
              <button
                className={styles.backButton}
                onClick={this.handleBackClick}>
                Back
              </button>
            )}
          </div>
        </Loading>
      </div>
    )
  }
}

export default TestRideForm
