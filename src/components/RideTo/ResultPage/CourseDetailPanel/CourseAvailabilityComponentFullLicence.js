import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import { getDasBikeTypes } from 'services/course'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'
import classnames from 'classnames'

const HOURLY_RATE = 2800 // TODO SORT THIS OUT

class CourseAvailabilityComponentFullLicence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      hasAutoBikes: false,
      hasManualBikes: false,
      autoLicences: [],
      manualLicences: []
    }
  }

  async componentDidMount() {
    const { id } = this.props.course
    const { automatic, manual } = await getDasBikeTypes(id)

    this.setState({
      loading: false,
      hasAutoBikes: Object.values(automatic).includes(true),
      hasManualBikes: Object.values(manual).includes(true),
      autoLicences: Object.keys(automatic).filter(key => automatic[key]),
      manualLicences: Object.keys(manual).filter(key => manual[key])
    })
  }

  render() {
    const {
      onUpdate,
      course,
      bike_hire,
      selectedLicenceType,
      selectedPackageDays,
      onSelectPackage,
      isWidget,
      phoneNumber = '02036039652.',
      selectedPackageHours
    } = this.props
    const {
      loading,
      hasAutoBikes,
      hasManualBikes,
      autoLicences,
      manualLicences
    } = this.state

    return (
      <div
        className={classnames(
          styles.fullLicenceAvailability,
          !isWidget ? styles.content : styles.widget
        )}>
        {!isWidget && (
          <div className={styles.subtitle1}>Full Licence (A1/A2 DAS)</div>
        )}
        <p
          className={classnames(
            styles.dasInfo,
            isWidget && styles.dasInfoWidget
          )}>
          Full motorcycle licence training is for anyone looking to progress
          from a CBT, to remove L plates, carry passengers and ride on
          motorways. Your age will determine what licence you can go for. Prices
          include everything you need, including test fees, bike hire and fuel.
          If you are unsure how many days training you need, call us on{' '}
          {phoneNumber}
        </p>

        <BikePicker
          isWidget={isWidget}
          isFullLicence
          bike_hire={bike_hire}
          onUpdate={onUpdate}
          course={course}
          has_auto_bikes={hasAutoBikes}
          has_manual_bikes={hasManualBikes}
          loading={loading}
        />

        <Fragment>
          <LicencePicker
            isWidget={isWidget}
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
            licences={bike_hire === 'manual' ? manualLicences : autoLicences}
          />
          <PackagePicker
            pricePerHour={course.pricePerHour || HOURLY_RATE}
            schoolId={course.id}
            isWidget={isWidget}
            bike_hire={bike_hire}
            selectedLicenceType={selectedLicenceType}
            selectedPackageDays={selectedPackageDays}
            selectedPackageHours={selectedPackageHours}
            onSelectPackage={onSelectPackage}
          />
        </Fragment>
      </div>
    )
  }
}

export default CourseAvailabilityComponentFullLicence
