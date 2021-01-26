import React, { useState, useEffect } from 'react'
import moment from 'moment'
import styles from './SupplierCourseDetail.scss'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'
import dropdownSmall from 'assets/icons/DropdownSmall.svg'
import CourseAvailabilityComponent from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponent'
// import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence'

const supplier = window.RIDETO_PAGE.supplier.supplier
let supplierData = Object.assign({}, supplier)
if (supplier.courses_info && supplier.courses_info.length) {
  supplierData = Object.assign(supplierData, supplier.courses_info[0])
}

const date = moment().format('YYYY-MM-DD')

const SupplierCourseDetail = ({ courseTypes, course }) => {
  const [courseType, setCourseType] = useState(course)
  const [courseInfo, setCourseInfo] = useState({
    instantCourse: null,
    instantDate: date,
    bike_hire: null
  })

  useEffect(() => {
    setCourseType(course)
  }, [course])

  const handleCourseChange = event => {
    const course = courseTypes.find(x => x.constant === event.target.value)
    setCourseType(course)
  }

  const onUpdate = value => {
    const tmp = Object.assign({}, courseInfo, value)
    setCourseInfo(tmp)
    console.log(tmp)
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
      {courseType.constant !== 'FULL_LICENCE' ? (
        <CourseAvailabilityComponent
          fromSupplier
          course={supplierData}
          courseType={course.constant}
          date={date}
          instantCourse={courseInfo.instantCourse}
          instantDate={courseInfo.instantDate}
          bike_hire={courseInfo.bike_hire}
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
