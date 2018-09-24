import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import MapComponent from '../MapComponent'
import CourseReviewsComponent from './CourseReviewsComponent'
import CourseAvailabilityComponent from './CourseAvailabilityComponent'
import CourseInformationComponent from './CourseInformationComponent'

class CourseDetailPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: [],
      activeTab: '1'
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  render() {
    const { course } = this.props
    const { activeTab } = this.state

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
        {activeTab === '1' && <CourseInformationComponent course={course} />}
        {activeTab === '1' && (
          <MapComponent className={styles.mapWrapper} courses={[course]} />
        )}
        {activeTab === '2' && <CourseReviewsComponent course={course} />}
        {activeTab === '3' && <CourseAvailabilityComponent course={course} />}
      </div>
    )
  }
}

export default CourseDetailPanel
