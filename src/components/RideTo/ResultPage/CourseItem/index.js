import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import StarsComponent from 'components/RideTo/StarsComponent'
import { IconArrowRight, IconInfo, IconDistance } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'

class CourseItem extends Component {
  handleDetailClick() {}

  render() {
    const { course, className, handleDetailClick } = this.props
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
            <div className={styles.icons}>
              <img src={FeatureIcons['Approved']} alt="feature" />
              <img src={FeatureIcons['Bike']} alt="feature" />
              <img src={FeatureIcons['Helmet']} alt="feature" />
            </div>
          </div>
          <div className={styles.extraInfo}>
            <IconDistance className={styles.mileIcon} />{' '}
            {course.distance_miles.toFixed(2)}mi
            <IconInfo className={styles.detailIcon} />{' '}
            <span
              onClick={() => handleDetailClick(course)}
              className={styles.detail}>
              Details
            </span>
            <StarsComponent
              rating={course.rating}
              className={styles.starComponent}
            />
            <span
              onClick={this.handleDetailClick.bind(this)}
              className={styles.detail}>
              {course.number_of_reviews}
            </span>
          </div>
        </div>
        <div className={styles.price}>
          <div>£{parseInt(course.price / 100.0, 10)}</div>
          <IconArrowRight className={styles.arrowIcon} />
        </div>
      </div>
    )
  }
}

export default CourseItem
