import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './CoursePackages.scss'
import CourseSummary from '../CourseSummary'
import { cancelCoursePackage } from 'store/course'

import { Button } from 'components/ConnectForm'

const AddCoursePackage = ({
  courses,
  date,
  instructors,
  schools,
  cancelCoursePackage
}) => {
  const handleSave = () => {}

  const handleCancel = () => {
    cancelCoursePackage()
  }

  return (
    <div className={styles.container}>
      {courses.map((course, index) => (
        <CourseSummary
          key={index}
          course={course}
          date={date}
          addingOrder={true}
          schools={schools}
          instructors={instructors}
          embedded={false}
        />
      ))}
      <div className={styles.actions}>
        <div>
          <Button
            color="primary"
            disabled={!courses.length}
            onClick={handleSave}>
            Save Package
          </Button>
        </div>
        <div>
          <Button color="white" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    instructors: state.instructor.instructors
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelCoursePackage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCoursePackage)
