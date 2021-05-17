import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
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
      selectedPackageHours,
      onSelectPackage,
      showDayOfWeekPicker,
      timeDayChange,
      selectedTimeDays,
      isErrored
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
            <span>Information</span>
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === 2 && styles.active
            )}
            onClick={() => this.toggle(2)}>
            <span>Reviews</span>
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === 3 && styles.active
            )}
            onClick={() => this.toggle(3)}>
            <span>Availability</span>
          </div>
        </div>
        {activeTab === 1 && (
          <CourseInformationComponent course={course} courseType={courseType} />
        )}
        {activeTab === 2 && <CourseReviewsComponent course={course} />}
        {activeTab === 3 && courseType !== 'FULL_LICENCE' && (
          <CourseAvailabilityComponent
            supplier={course}
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
            selectedLicenceType={selectedLicenceType}
            selectedPackageHours={selectedPackageHours}
            showDayOfWeekPicker={showDayOfWeekPicker}
            timeDayChange={timeDayChange}
            selectedTimeDays={selectedTimeDays}
            isErrored={isErrored}
          />
        )}
      </div>
    )
  }
}

export default CourseDetailPanel
