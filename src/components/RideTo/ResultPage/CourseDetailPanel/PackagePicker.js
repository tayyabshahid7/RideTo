import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { calcFullLicencePrices } from 'services/course'

const packages = [
  {
    name: 'Introduction',
    hours: 16,
    desc:
      '2 days of training without tests. Suitable for riders to start learning the core skills of riding and prepare for the full motorcycle module 1 and 2 tests. You’ll usually start off on a smaller bike to get to grips with gears and balance such as slow control. Then moving onto the full bike size for the category of your licence; typically a 500cc for an A2 licence and 650cc for full A licence. The introduction course is perfect for a new rider looking to start their learning without committing to test dates.'
  },
  {
    name: 'Experienced',
    hours: 30,
    desc:
      '4 Days of training to learn and take both module 1 and 2 tests. Suitable for experienced riders only. The first section of the course will be focused on preparing you for Module 1. Plenty of off-road balance and control practice for the required maneuvers of the module 1 test. Once you’ve passed the module 1 test, you’ll then start training for the module 2 test. Similar to the driving test, this involves road riding through various conditions, assessing your awareness and progress. The experienced rider course is only for riders with a large amount of experience riding a geared motorcycle on the UK roads.'
  },
  {
    name: 'Intermediate',
    hours: 40,
    desc:
      '5 days of training to learn and take both module 1 and 2 tests. Suitable for riders with experience on a CBT licence. You’ll usually start off on a smaller bike to get to grips with gears and balance such as slow control. The first section of the course will be focused on preparing you for Module 1. Plenty of off-road balance and control practice for the required maneuvers of the module 1 test. Once you’ve passed the module 1 test, you’ll then start training for the module 2 test. Similar to the driving test, this involves road riding through various conditions, assessing your awareness and progress'
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
