import React, { Fragment } from 'react'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import { getStaticData } from 'services/page'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import * as FeatureIcons from 'assets/icons/features'
import MapComponent from 'components/RideTo/MapComponent'
import StarsComponent from 'components/RideTo/StarsComponent'

class CourseDetailPanel extends React.Component {
  constructor(props) {
    super(props)

    const staticData = getStaticData('RIDETO_PAGE')
    this.selectedCourseType = staticData.courseTypes.find(
      type => type.constant === this.props.courseType
    )
    this.isFullLicence = this.selectedCourseType.constant === 'FULL_LICENCE'
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
    const description = !this.isFullLicence
      ? "On the day of the training you'll need to bring a Valid UK Driving or Provisional Licence, wear sturdy Jeans and Boots (something which protect your feet such as walking boots) and suitable clothes forbeing outside all day."
      : "On the day of training you'll need to bring a Valid UK Driving or Provisional Licence, wear sturdy Jeans and Boots and suitable clothes for being outside all day. You must also bring your valid CBT and Motorcycle Theory certificates."

    return (
      <Fragment>
        <div className={styles.content}>
          <div className={styles.subtitle}>
            {`${getCourseTitle(courseType).replace(
              ' Training',
              ''
            )} ${course.location_slug.replace('-', ' ')}`}
          </div>
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
        <CourseTypeDetails
          courseType={this.selectedCourseType}
          title="Course information"
        />
        <div className={styles.bring}>
          <div className={styles.subtitle}>What you need to bring</div>
          <div className={styles.desc}>{description}</div>
        </div>
        <div className={styles.locationInfo}>
          <div className={styles.subtitle}>Location</div>
          <div className={styles.address}>{`${course.place} ${
            course.postcode
          }`}</div>
          <MapComponent className={styles.mapWrapper} courses={[course]} />
        </div>
        <div className={styles.instructor}>
          <div className={styles.subtitle}>The Instructor</div>
          <div className={styles.desc}>{course.rideto_opinion}</div>
          <div className={styles.hostedLogo}>
            <img src={course.hosted_logo} alt="feature" />
          </div>
          <div>
            <StarsComponent
              rating={course.rating}
              className={styles.starComponent}
            />
          </div>
        </div>
      </Fragment>
    )
  }
}

export default CourseDetailPanel
