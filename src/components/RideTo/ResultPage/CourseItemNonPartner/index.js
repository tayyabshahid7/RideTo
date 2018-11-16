import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import { IconDistance } from 'assets/icons'

class CourseItemNonPartner extends Component {
  highlightPinOnMap(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
      mapPin.classList.add(styles.mapPinHighlight)
    }
  }

  removeHighlight(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
    }
  }

  render() {
    const { course, className, id } = this.props

    const mailBody = `Hi ${
      course.name
    }, I'd like to find out more information about your CBT training.\n\nWhat availability do you have and what are the prices?\n\nMany thanks,`

    const mailToURL =
      course.email +
      '?cc=hello@rideto.com&subject=Enquiry via RideTo.com - CBT training at ' +
      course.name +
      '&body=' +
      encodeURIComponent(mailBody)

    return (
      <div
        id={id}
        onMouseEnter={this.highlightPinOnMap}
        onMouseLeave={this.removeHighlight}
        className={classnames(styles.container, className)}>
        <div className={styles.info}>
          <div className={styles.upperSection}>
            <div className={styles.courseName}>{course.name}</div>
            <div className={styles.place}>
              {course.place}, {course.postcode}
            </div>
          </div>
          <div className={styles.extraInfo}>
            <IconDistance className={styles.mileIcon} />{' '}
            {course.distance_miles.toFixed(2)}
            mi
          </div>
        </div>
        <div
          className={styles.contactSchool}
          onClick={() => (window.location.href = 'mailto:' + mailToURL)}>
          Contact School
        </div>
      </div>
    )
  }
}

export default CourseItemNonPartner
