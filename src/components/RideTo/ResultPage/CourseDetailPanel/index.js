import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import MapComponent from 'components/RideTo/MapComponent'
import CourseReviewsComponent from './CourseReviewsComponent'
import CourseAvailabilityComponent from './CourseAvailabilityComponent'
import CourseAvailabilityComponentFullLicence from './CourseAvailabilityComponentFullLicence'
import CourseInformationComponent from './CourseInformationComponent'

class CourseDetailPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: []
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(tab) {
    const { activeTab, onChangeTab } = this.props
    if (activeTab !== tab) {
      onChangeTab(tab)
    }
  }

  render() {
    const {
      course,
      date,
      instantCourse,
      instantDate,
      onUpdate,
      bike_hire,
      activeTab,
      courseType,
      selectedLicenceType,
      selectedPackageDays,
      onSelectPackage,
      onSelectPackageDate,
      selectedPackageDates
    } = this.props

    return (
      <div className={styles.courseDetails}>
        <div className={styles.tab}>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === 1 && styles.active
            )}
            onClick={() => this.toggle(1)}>
            Information
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === 2 && styles.active
            )}
            onClick={() => this.toggle(2)}>
            Reviews
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === 3 && styles.active
            )}
            onClick={() => this.toggle(3)}>
            Availability
          </div>
        </div>
        {activeTab === 1 && <CourseInformationComponent course={course} />}
        {activeTab === 1 && (
          <MapComponent className={styles.mapWrapper} courses={[course]} />
        )}
        {activeTab === 2 && <CourseReviewsComponent course={course} />}
        {activeTab === 3 && courseType !== 'FULL_LICENCE' && (
          <CourseAvailabilityComponent
            course={course}
            courseType={courseType}
            date={date}
            instantCourse={instantCourse}
            instantDate={instantDate}
            bike_hire={bike_hire}
            onUpdate={onUpdate}
          />
        )}
        {activeTab === 3 && courseType === 'FULL_LICENCE' && (
          <CourseAvailabilityComponentFullLicence
            course={course}
            bike_hire={bike_hire}
            onUpdate={onUpdate}
            onSelectPackage={onSelectPackage}
            onSelectPackageDate={onSelectPackageDate}
            selectedLicenceType={selectedLicenceType}
            selectedPackageDays={selectedPackageDays}
            selectedPackageDates={selectedPackageDates}
          />
        )}
      </div>
    )
  }
}

export default CourseDetailPanel
