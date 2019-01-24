import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import CourseReviewsComponent from './CourseReviewsComponent'
import CourseAvailabilityComponent from './CourseAvailabilityComponent'
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
      courseType
    } = this.props

    return (
      <div className={styles.courseDetails}>
        <div className={styles.tab}>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === '1' && styles.active
            )}
            onClick={() => this.toggle('1')}>
            Information
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === '2' && styles.active
            )}
            onClick={() => this.toggle('2')}>
            Reviews
          </div>
          <div
            className={classnames(
              styles.tabItem,
              activeTab === '3' && styles.active
            )}
            onClick={() => this.toggle('3')}>
            Availability
          </div>
        </div>
        {activeTab === '1' && (
          <CourseInformationComponent course={course} courseType={courseType} />
        )}
        {activeTab === '2' && <CourseReviewsComponent course={course} />}
        {activeTab === '3' && (
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
      </div>
    )
  }
}

export default CourseDetailPanel
