import * as FeatureIcons from 'assets/icons/features'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import MapComponent from 'components/RideTo/MapComponent'
import StarsComponent from 'components/RideTo/StarsComponent'
import React, { Fragment } from 'react'
import { getCourseTitle } from 'services/course'
import { getStaticData } from 'services/page'
import styles from './styles.scss'

class CourseInformationComponent extends React.Component {
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

  renderSupplierLogo() {
    const { course } = this.props
    return (
      <React.Fragment>
        <div className={styles.hostedLogo}>
          <img src={course.hosted_logo} alt="feature" />
        </div>
        <div>
          <StarsComponent
            rating={course.rating}
            className={styles.starComponent}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    const { course, courseType } = this.props

    let instructorText = course.rideto_opinion.substr(0, 500)
    if (course.rideto_opinion.length > 500) {
      instructorText += ' ...'
    }

    const description = !this.isFullLicence
      ? "On the day of the training you'll need to bring a Valid UK Driving or Provisional Licence, wear sturdy Jeans and Boots (something which protect your feet such as walking boots) and suitable clothes for being outside all day."
      : "On the day of training you'll need to bring a Valid UK Driving or Provisional Licence, wear sturdy Jeans and Boots and suitable clothes for being outside all day. You must also bring your valid CBT and Motorcycle Theory certificates."

    const instructorStr = instructorText.replace(/<[^>]+>/g, '')
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
            {course.gloves_jacket_included &&
              this.renderFeature('Gloves', 'Gloves & Jacket Provided')}
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
          <div
            className={
              styles.address
            }>{`${course.place} ${course.postcode}`}</div>
          <MapComponent
            className={styles.mapWrapper}
            courses={[course]}
            courseLat={course.lat}
            courseLgn={course.lng}
            courseSidePanel={course}
            sidebar
            handleSearchLocation={e => {}}
          />
        </div>
        <div className={styles.instructor}>
          <div className={styles.subtitle}>The Instructor</div>
          {course.publish_supplier_page && course.supplier_page_link ? (
            <div className={styles.desc}>
              {instructorStr}
              {course.rideto_opinion.length > 500 && (
                <a
                  className={styles.supplierLink}
                  href={course.supplier_page_link}>
                  READ MORE
                </a>
              )}
            </div>
          ) : (
            <div className={styles.desc}>{course.rideto_opinion}</div>
          )}

          {course.publish_supplier_page && course.supplier_page_link ? (
            <a className={styles.supplierLink} href={course.supplier_page_link}>
              {this.renderSupplierLogo()}
            </a>
          ) : (
            this.renderSupplierLogo()
          )}
        </div>
      </Fragment>
    )
  }
}

export default CourseInformationComponent
