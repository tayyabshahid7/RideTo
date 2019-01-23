import React, { Fragment } from 'react'
import styles from './styles.scss'
import { getShortCourseType } from 'services/course'
import { getStaticData } from 'services/page'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import * as FeatureIcons from 'assets/icons/features'

class CourseDetailPanel extends React.Component {
  constructor(props) {
    super(props)

    const staticData = getStaticData('RIDETO_PAGE')
    this.selectedCourseType = staticData.courseTypes.find(
      type => type.constant === this.props.courseType
    )
  }

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
    const { course, courseType } = this.props

    return (
      <Fragment>
        {' '}
        <div className={styles.content}>
          <div className={styles.subtitle}>
            {`${getShortCourseType(courseType)} ${course.location_slug.replace(
              '-',
              ' '
            )}`}
          </div>
          <div className={styles.address}>{`${course.place} ${
            course.postcode
          }`}</div>
          <div className={styles.desc}>{course.rideto_opinion}</div>
          {/*
        <div className={styles.hostedLogo}>
          <img src={course.hosted_logo} alt="feature" />
        </div>
      */}
          <div className={styles.features}>
            {course.mciac_approved &&
              this.renderFeature('Approved', 'MCIAC Approved')}
            {course.bike_hire &&
              this.renderFeature('Bike', 'Bike Hire Included')}
            {course.helmet_hire &&
              this.renderFeature('Helmet', 'Helmet Hire Included')}
            {course.on_site_cafe && this.renderFeature('Cafe', 'On Site Cafe')}
            {course.indoor_classroom &&
              this.renderFeature('Class', 'Indoor Classroom')}
          </div>
        </div>
        <CourseTypeDetails courseType={this.selectedCourseType} />
      </Fragment>
    )
  }
}

export default CourseDetailPanel
