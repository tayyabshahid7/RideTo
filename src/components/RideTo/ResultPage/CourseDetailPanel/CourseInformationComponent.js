import React from 'react'
import styles from './styles.scss'
import * as FeatureIcons from 'assets/icons/features'

class CourseDetailPanel extends React.Component {
  render() {
    const { course } = this.props

    return (
      <div className={styles.content}>
        <div className={styles.subtitle}>{course.name}</div>
        <div className={styles.desc}>{course.rideto_opinion}</div>
        <div className={styles.hostedLogo}>
          <img src={course.hosted_logo} alt="feature" />
        </div>
        <div className={styles.features}>
          <div className={styles.feature}>
            <img
              src={FeatureIcons['Approved']}
              alt="feature"
              className={styles.featureIcon}
            />{' '}
            <span className={styles.featureText}> Helmet Hire Included</span>
          </div>
          <div className={styles.feature}>
            <img
              src={FeatureIcons['Bike']}
              alt="feature"
              className={styles.featureIcon}
            />{' '}
            <span className={styles.featureText}> Bike Hire Included</span>
          </div>
        </div>
      </div>
    )
  }
}

export default CourseDetailPanel
