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

    this.state = {
      showAll: !this.props.needsHelp
    }

    this.handleChange = this.handleChange.bind(this)
    this.onShowAllClick = this.onShowAllClick.bind(this)
  }

  handleChange(event) {
    const { onSelectPackage } = this.props

    onSelectPackage(event.target.value)
  }

  displayPrice(pricePerHour, hours) {
    const [now, later] = calcFullLicencePrices(pricePerHour, hours)

    return `£${now} now, £${later} later`
  }

  onShowAllClick() {
    this.setState({
      showAll: true
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.needsHelp !== this.props.needsHelp) {
      this.setState({
        showAll: !this.props.needsHelp
      })
    }
  }

  render() {
    const {
      pricePerHour,
      onSelectPackage,
      selectedPackageHours,
      isWidget,
      needsHelp
    } = this.props
    const { showAll } = this.state
    let filteredPackages = packages

    if (!showAll && selectedPackageHours) {
      filteredPackages = packages.filter(
        ({ hours }) => selectedPackageHours === hours
      )
    }

    return (
      <div
        className={classnames(
          styles.packageWrapper,
          isWidget && styles.packageWrapperWidget
        )}>
        <label id="choose-package" className={styles.subtitle1}>
          {!needsHelp && <span className={styles.stepNumber}>4</span>} Course
          duration{' '}
          {needsHelp && !showAll && (
            <button
              className={styles.showAllButton}
              onClick={this.onShowAllClick}>
              Show all
            </button>
          )}
        </label>
        <ul className={styles.packageButtonList}>
          {filteredPackages.map(({ name, hours, desc }) => (
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
