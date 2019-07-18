import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { calcFullLicencePrices } from 'services/course'

const packages = [
  {
    name: 'Introduction',
    hours: 16,
    desc:
      'Velit duis non laborum officia excepteur nulla non velit sed et laboris nisi ex cillum nostrud esse ad do proident qui enim ullamco incididunt deserunt nisi aliquip laborum minim anim dolore in irure magna dolor in.'
  },
  {
    name: 'Experienced',
    hours: 30,
    desc:
      'Velit duis non laborum officia excepteur nulla non velit sed et laboris nisi ex cillum nostrud esse ad do proident qui enim ullamco incididunt deserunt nisi aliquip laborum minim anim dolore in irure magna dolor in.'
  },
  {
    name: 'Intermediate',
    hours: 40,
    desc:
      'Velit duis non laborum officia excepteur nulla non velit sed et laboris nisi ex cillum nostrud esse ad do proident qui enim ullamco incididunt deserunt nisi aliquip laborum minim anim dolore in irure magna dolor in.'
  }
]

class PackagePicker extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { onSelectPackage } = this.props

    onSelectPackage(event.target.value)
  }

  displayPrice(pricePerHour, hours) {
    const [now, later] = calcFullLicencePrices(pricePerHour, hours)

    return `£${now} now, £${later} later`
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
        <label id="choose-package" className={styles.subtitle1}>
          <span className={styles.stepNumber}>4</span> Choose course duration
        </label>
        <ul className={styles.packageButtonList}>
          {packages.map(({ name, hours, desc }) => (
            <li key={name}>
              <button
                className={classnames(
                  styles.packageButton,
                  selectedPackageHours === hours && styles.packageButtonActive
                )}
                onClick={() => {
                  onSelectPackage(hours)
                }}>
                <span>
                  {name} ({hours} hours)
                </span>
                <span>{this.displayPrice(pricePerHour, hours)}</span>
                {desc}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default PackagePicker
