import React, { useState, useEffect } from 'react'
import styles from './SupplierCourseDetail.scss'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'
import dropdownSmall from 'assets/icons/DropdownSmall.svg'

const SupplierCourseDetail = ({ courseTypes, course }) => {
  const [courseType, setCourseType] = useState(course)

  useEffect(() => {
    console.log('changed', course)
    setCourseType(course)
  }, [course])

  const handleCourseChange = event => {
    const course = courseTypes.find(x => x.constant === event.target.value)
    setCourseType(course)
  }

  return (
    <React.Fragment>
      <h5>COURSE TYPE</h5>
      <div className={styles.courseInput}>
        <select
          className={styles.input}
          value={courseType.constant}
          onChange={handleCourseChange}>
          {courseTypes.map(
            ({ constant, name }) =>
              AVAILABLE_COURSE_TYPES.includes(constant) && (
                <option key={constant} value={constant}>
                  {name}
                </option>
              )
          )}
        </select>
        <img
          className={styles.inputDropdown}
          src={dropdownSmall}
          alt="dropdown icon"
        />
      </div>
    </React.Fragment>
  )
}

export default SupplierCourseDetail
