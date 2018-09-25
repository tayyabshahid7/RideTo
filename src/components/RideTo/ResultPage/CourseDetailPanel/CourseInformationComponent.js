import React from 'react'
import styles from './styles.scss'
import * as FeatureIcons from 'assets/icons/features'

class CourseDetailPanel extends React.Component {
  renderFeature(iconName, title) {
    return (
      <div className={styles.feature}>
        <img
          src={FeatureIcons[iconName]}
          alt="feature"
          className={styles.featureIcon}
        />{' '}
        <span className={styles.featureText}> {title}</span>
      </div>
    )
  }

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
          {course.mciac_approved &&
            this.renderFeature('Approved', 'MCIAC Approved')}
          {course.bike_hire && this.renderFeature('Bike', 'Bike Hire Included')}
          {course.helmet_hire &&
            this.renderFeature('Helmet', 'Helmet Hire Included')}
          {course.on_site_cafe && this.renderFeature('Cafe', 'On Site Cafe')}
          {course.indoor_classroom &&
            this.renderFeature('Class', 'Indoor Classroom')}
        </div>
      </div>
    )
  }
}

export default CourseDetailPanel
