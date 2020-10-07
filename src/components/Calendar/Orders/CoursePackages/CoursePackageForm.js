import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './CoursePackages.scss'
import CourseSummary from '../../CoursesPanel/CourseSummary'
import DateHeading from 'components/Calendar/DateHeading'
import LoadingMask from 'components/LoadingMask'
import {
  savePackage,
  cancelCoursePackage,
  deleteCoursePackage,
  finishCoursePackage,
  removeCourseFromPackage
} from 'store/course'

import { Button, ConnectInput } from 'components/ConnectForm'

const CoursePackageForm = ({
  courses,
  date,
  instructors,
  schools,
  initialPrice,
  editing,
  saving,
  error,
  orderDetail,
  savePackage,
  cancelCoursePackage,
  deleteCoursePackage,
  finishCoursePackage,
  removeCourseFromPackage
}) => {
  const [price, setPrice] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  // return to order detail after package is updated
  useEffect(() => {
    if (!saving && submitted && !error) {
      finishCoursePackage(price)
    }
  }, [saving, submitted])

  useEffect(() => {
    if (initialPrice) {
      setPrice(initialPrice)
    }
  }, [initialPrice])

  const handleSave = () => {
    if (orderDetail.packageId) {
      const courseIds = courses.map(x => x.id.toString())
      savePackage(orderDetail.packageId, courseIds, price * 100)
      setSubmitted(true)
    } else {
      finishCoursePackage(price)
    }
  }

  const handleCancel = () => {
    cancelCoursePackage()
  }

  const handleRemoveCourse = course => {
    removeCourseFromPackage(course)
  }

  const handlePriceChange = event => {
    const { value } = event.target
    setPrice(value)
  }

  const handleDelete = () => {
    deleteCoursePackage(orderDetail.packageId)
    setSubmitted(true)
  }

  const title = editing ? 'Edit Package' : 'Create Package'
  const subtitle =
    'You can add more courses to this package by clicking on them in the calendar'

  return (
    <div className={styles.container}>
      <DateHeading title={title} subtitle={subtitle} noClose />
      {courses.map((course, index) => (
        <CourseSummary
          key={index}
          course={course}
          date={date}
          addingOrder={true}
          schools={schools}
          instructors={instructors}
          embedded={false}
          canRemove={true}
          onRemove={() => handleRemoveCourse(course)}
        />
      ))}
      <ConnectInput
        basic
        className={styles.inputNumber}
        name="price"
        label="Total Package Cost"
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
            disabled={!price || courses.length < 2}
            onClick={handleSave}>
            Save Package
          </Button>
        </div>
        <div>
          <Button color="white" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        {editing && (
          <div>
            <Button
              color="danger"
              className={styles.deleteButton}
              onClick={handleDelete}>
              Delete Package
            </Button>
          </div>
        )}
      </div>
      <LoadingMask loading={saving} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    instructors: state.instructor.instructors,
    initialPrice: state.course.coursePackage.price,
    editing: state.course.coursePackage.editing,
    orderDetail: state.course.order,
    saving: state.course.coursePackage.saving,
    error: state.course.coursePackage.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelCoursePackage,
      deleteCoursePackage,
      finishCoursePackage,
      removeCourseFromPackage,
      savePackage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursePackageForm)
