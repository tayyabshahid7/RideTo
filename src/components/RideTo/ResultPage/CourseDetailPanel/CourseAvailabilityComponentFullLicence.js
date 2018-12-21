import React, { Component } from 'react'
import styles from './styles.scss'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'

class CourseAvailabilityComponent extends Component {
  render() {
    const { onUpdate, course, bike_hire, selectedLicenceType } = this.props

    return (
      <div className={styles.content}>
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
      </div>
    )
  }
}

export default CourseAvailabilityComponent
