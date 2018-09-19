import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import StarsComponent from 'components/RideTo/StarsComponent'

class CourseItem extends Component {
  render() {
    const { course, className } = this.props
    return (
      <div className={classnames(styles.container, className)}>
        <div className={styles.photo}>
          <img src={course.image} className={styles.image} alt="logo" />
        </div>
        <div className={styles.info}>
          <div className={styles.upperSection}>
            <div className={styles.courseName}>{course.name}</div>
            <div className={styles.place}>
              {course.place}, {course.postcode}
            </div>
            <div className={styles.icons} />
          </div>
          <div className={styles.extraInfo}>
            <span>{course.distance_miles.toFixed(2)}mi</span>
            <span className="ml-3">Details</span>
            <StarsComponent rating={course.rating} className="ml-3" />
            <span className="ml-2">{course.number_of_reviews}</span>
          </div>
        </div>
        <div className={styles.price}>
          <div>£{(course.price / 100.0).toFixed(2)}</div>
        </div>
      </div>
    )
  }
}

export default CourseItem
