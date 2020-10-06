import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './CoursePackages.scss'
import CourseSummary from '../CourseSummary'
import { cancelCoursePackage, createCoursePackage } from 'store/course'

import { Button, ConnectInput } from 'components/ConnectForm'

const AddCoursePackage = ({
  courses,
  date,
  instructors,
  schools,
  cancelCoursePackage,
  createCoursePackage,
  updateAdding
}) => {
  const [price, setPrice] = useState(0)

  const handleSave = () => {
    const courseIds = courses.map(x => x.id)
    createCoursePackage(courseIds, price)
    updateAdding(courseIds[0])
  }

  const handleCancel = () => {
    cancelCoursePackage()
  }

  const handlePriceChange = event => {
    const { value } = event.target
    setPrice(value)
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
      <ConnectInput
        basic
        className={styles.inputNumber}
        name="price"
        value={price}
        type="number"
        min="0"
        prefix="£"
        onChange={handlePriceChange}
        raw
        required
      />
      <div className={styles.actions}>
        <div>
          <Button
            color="primary"
            disabled={courses.length < 2}
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
      cancelCoursePackage,
      createCoursePackage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCoursePackage)
