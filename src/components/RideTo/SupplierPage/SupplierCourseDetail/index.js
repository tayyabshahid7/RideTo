import React, { useState, useEffect } from 'react'
import styles from './SupplierCourseDetail.scss'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'
import dropdownSmall from 'assets/icons/DropdownSmall.svg'
import CourseAvailabilityComponent from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponent'
import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence'

const supplier = window.RIDETO_PAGE.supplier.supplier
console.log(supplier)

supplier.bank_holiday_start_time = '08:45:00'
supplier.weekday_start_time = '08:45:00'
supplier.weekend_start_time = '06:45:00'

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

  const onUpdate = value => {
    console.log(value)
  }

  console.log(course)

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
      {course.constant !== 'FULL_LICENCE' ? (
        <CourseAvailabilityComponent
          fromSupplier
          course={supplier}
          courseType={course.constant}
          date={null}
          instantCourse={false}
          instantDate={null}
          bike_hire={null}
          onUpdate={onUpdate}
        />
      ) : null
      // <CourseAvailabilityComponentFullLicence
      //   course={course}
      //   bike_hire={bike_hire}
      //   onUpdate={onUpdate}
      //   onSelectPackage={onSelectPackage}
      //   selectedLicenceType={selectedLicenceType}
      //   selectedPackageHours={selectedPackageHours}
      //   showDayOfWeekPicker={showDayOfWeekPicker}
      //   timeDayChange={timeDayChange}
      //   selectedTimeDays={selectedTimeDays}
      //   isErrored={isErrored}
      // />
      }
    </React.Fragment>
  )
}

export default SupplierCourseDetail
