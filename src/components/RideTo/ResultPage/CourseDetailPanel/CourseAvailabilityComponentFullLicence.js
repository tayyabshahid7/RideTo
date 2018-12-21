import React, { Component } from 'react'
import styles from './styles.scss'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'

class CourseAvailabilityComponent extends Component {
  render() {
    const { onUpdate, course, bike_hire } = this.props

    return (
      <div className={styles.content}>
        <p>pick some stuff</p>

        <BikePicker
          bike_hire={bike_hire}
          onUpdate={onUpdate}
          course={course}
          has_auto_bikes={course.has_auto_bikes}
          has_manual_bikes={course.has_manual_bikes}
        />
      </div>
    )
  }
}

export default CourseAvailabilityComponent
