import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

class PackagePicker extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { onSelectPackage } = this.props

    onSelectPackage(event.target.value)
  }

  render() {
    const {
      pricePerHour,
      onSelectPackage,
      selectedPackageHours,
      isWidget
    } = this.props

    return (
      <div
        className={classnames(
          styles.packageWrapper,
          isWidget && styles.packageWrapperWidget
        )}>
        <label id="choose-licence" className={styles.subtitle1}>
          Training Package
        </label>
        <ul className={styles.packageButtonList}>
          <li>
            <button
              className={classnames(
                styles.packageButton,
                selectedPackageHours === 16 && styles.packageButtonActive
              )}
              onClick={() => {
                onSelectPackage(16)
              }}>
              <span>16 hours | £{(pricePerHour / 100) * 16} - Intro</span>2 days
              of training without tests. Suitable for riders to start learning.
            </button>
          </li>
          <li>
            <button
              className={classnames(
                styles.packageButton,
                selectedPackageHours === 32 && styles.packageButtonActive
              )}
              onClick={() => {
                onSelectPackage(32)
              }}>
              <span>
                32 hours | £{(pricePerHour / 100) * 32} - Training & Tests
              </span>
              4 Days of training to learn and take both module 1 and 2 tests.
              Suitable for experienced riders only.
            </button>
          </li>
          <li>
            <button
              className={classnames(
                styles.packageButton,
                selectedPackageHours === 40 && styles.packageButtonActive
              )}
              onClick={() => {
                onSelectPackage(40)
              }}>
              <span>
                40 hours | £{(pricePerHour / 100) * 40} - Training & Tests
              </span>
              4 days of training to learn and take both module 1 and 2 testes.
              Suitable for experienced riders only.
            </button>
          </li>
        </ul>
      </div>
    )
  }
}

export default PackagePicker
