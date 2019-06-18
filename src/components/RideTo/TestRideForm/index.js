import React, { Component } from 'react'
import styles from './styles.scss'
import rangeInclusive from 'range-inclusive'
import { getParam } from 'utils/helper'
import { fetchBike, mapBike } from 'services/bike-sales'

const STEPS = [
  {
    id: 1,
    name: 'Location',
    title: "What's your post code?"
  },
  {
    id: 2,
    name: 'Licence',
    title: 'What licence do you have?'
  },
  {
    id: 3,
    name: 'Date',
    title: 'When do you want to see the bike'
  },

  {
    id: 4,
    name: 'Email',
    title: 'Ready to book your test ride?',
    desc:
      'Enter your email and we’ll send you times to view the bike at a local dealer'
  }
]

class TestRideForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      step: 1,
      bike: null,
      postcode: ''
    }

    this.handleBackClick = this.handleBackClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  async componentDidMount() {
    const id = getParam(window.location.search, 'id')

    if (!id) {
      window.location.replace('/bike-reviews')
    }

    const bike = await fetchBike(id)

    this.setState({
      bike: mapBike(bike)
    })
  }

  handleFormSubmit(event) {
    const { step } = this.state

    event.preventDefault()

    this.setState({
      step: step + 1
    })
  }

  handleInputChange({ target: { name, value } }) {
    this.setState({
      [name]: value
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
      postcode
    } = this.state
    const { name, title, desc } = STEPS.find(({ id }) => id === step)

    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{bikeName} Test Ride</h1>
            <div className={styles.steps}>
              <div>
                Step {step}/4: {name}
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
            <h2 className={styles.formTitle}>{title}</h2>
            {desc && <p>{desc}</p>}
            <div className={styles.formControls}>
              <label className={styles.inputGroup}>
                <span className={styles.icon}>
                  <span className="fas fa-map-marker-alt"></span>
                </span>
                <input
                  className={styles.input}
                  type="text"
                  required
                  onChange={this.handleInputChange}
                  name="postcode"
                  value={postcode}
                />
              </label>
            </div>
            <button className={styles.nextButton}>Next</button>
          </form>
          <div className={styles.footer}>
            <button
              className={styles.backButton}
              onClick={this.handleBackClick}>
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default TestRideForm
