import React, { Component } from 'react'
import styles from './styles.scss'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'

class CourseAvailabilityComponent extends Component {
  render() {
    const {
      onUpdate,
      course,
      bike_hire,
      selectedLicenceType,
      selectedPackageDays
    } = this.props

    return (
      <div className={styles.content}>
        <div className={styles.subtitle1}>Full Licence (A1/A2 DAS)</div>
        <p className={styles.dasInfo}>
          DAS courses take place over multiple days.
        </p>
        <BikePicker
          isFullLicence
          bike_hire={bike_hire}
          onUpdate={onUpdate}
          course={course}
          has_auto_bikes={course.has_auto_bikes}
          has_manual_bikes={course.has_manual_bikes}
        />
        <LicencePicker
          selectedLicenceType={selectedLicenceType}
          onUpdate={onUpdate}
        />
        <PackagePicker
          bike_hire={bike_hire}
          selectedLicenceType={selectedLicenceType}
          selectedPackageDays={selectedPackageDays}
          onUpdate={onUpdate}
        />
      </div>
    )
  }
}

export default CourseAvailabilityComponent
