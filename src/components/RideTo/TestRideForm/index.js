import React, { Component } from 'react'
import styles from './styles.scss'
import rangeInclusive from 'range-inclusive'
import { getParam } from 'utils/helper'
import { fetchBike, mapBike } from 'services/bike-sales'

class TestRideForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      step: 1,
      bike: null
    }
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

  render() {
    if (!this.state.bike) {
      return null
    }

    const {
      step,
      bike: { name }
    } = this.state

    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.steps}>
              <div>Step 1/4: Location</div>
              <ol className={styles.stepsList}>
                {rangeInclusive(4).map(i => (
                  <li
                    className={step === i ? styles.active : undefined}
                    key={i}>
                    Step {i}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <form className={styles.main}>
            <h2 className={styles.formTitle}>What's your post code?</h2>
            <div className={styles.formControls}>
              <label className={styles.inputGroup}>
                <span className={styles.icon}>
                  <span className="fas fa-map-marker-alt"></span>
                </span>
                <input className={styles.input} type="text" required />
              </label>
            </div>
            <button className={styles.nextButton}>Next</button>
          </form>
          <div className={styles.footer}>
            <button className={styles.backButton}>Back</button>
          </div>
        </div>
      </div>
    )
  }
}

export default TestRideForm
