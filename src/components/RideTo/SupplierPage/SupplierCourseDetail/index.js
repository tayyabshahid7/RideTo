import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import RideToButton from 'components/RideTo/Button'
import styles from './SupplierCourseDetail.scss'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'
import dropdownSmall from 'assets/icons/DropdownSmall.svg'
import { flashDiv } from 'services/page'
import { LICENCE_TYPES } from 'common/constants'
import CourseAvailabilityComponent from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponent'
import { SupplierContext } from '../supplier-context'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ArrowLeftGreen from 'assets/images/rideto/ArrowLeftGreen.svg'
import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence'
import { isBankHoliday } from 'services/misc'

const date = moment().format('YYYY-MM-DD')

const SupplierCourseDetail = ({ courseTypes, course }) => {
  const [courseType, setCourseType] = useState(course)
  const [courseInfo, setCourseInfo] = useState({
    instantCourse: null,
    instantDate: date,
    bike_hire: null,
    selectedLicenceType: null,
    selectedPackageHours: 0,
    showDayOfWeekPicker: false,
    selectedTimeDays: [],
    isErrored: false
  })
  const { supplier } = React.useContext(SupplierContext)
  const bottomAnchor = useRef(null)

  useEffect(() => {
    setCourseType(course)
  }, [course])

  const handleCourseChange = event => {
    const tmp = courseTypes.find(x => x.constant === event.target.value)
    setCourseType(tmp)
  }

  const onUpdate = value => {
    const tmp = Object.assign({}, courseInfo, value)
    setCourseInfo(tmp)

    // setTimeout(() => {
    //   bottomAnchor.current.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end'
    //   })
    // }, 99)
  }

  let { courses_info, ...supplierData } = supplier
  const tmpInfo = courses_info.find(x => x.course_name === courseType.name)
  if (tmpInfo) {
    supplierData = Object.assign(supplierData, tmpInfo)
  }

  const isFullLicence = courseType.constant === 'FULL_LICENCE'

  let bookNowDisabled = false
  bookNowDisabled =
    (supplierData.instant_book && !courseInfo.instantCourse) ||
    !courseInfo.bike_hire ||
    !courseInfo.instantDate

  if (isFullLicence) {
    bookNowDisabled = true
  }

  if (
    isFullLicence &&
    courseInfo.bike_hire &&
    courseInfo.selectedLicenceType &&
    courseInfo.selectedPackageHours
  ) {
    bookNowDisabled = false
  }

  if (
    courseInfo.showDayOfWeekPicker &&
    courseInfo.selectedTimeDays.length < 1
  ) {
    bookNowDisabled = true
  }

  const onSelectPackage = hours => {
    onUpdate({
      selectedPackageHours: hours
    })
  }

  const getStartTime = (course, selectedDate) => {
    const mdate = moment(selectedDate)
    if (isBankHoliday(mdate.format('DD-MM-YYYY'))) {
      return course.bank_holiday_start_time.substring(0, 5)
    }
    if (mdate.day() === 6 || mdate.day() === 0) {
      return course.weekend_start_time.substring(0, 5)
    } else {
      return course.weekday_start_time.substring(0, 5)
    }
  }

  const onBookNow = () => {
    const {
      instantCourse,
      instantDate,
      bike_hire,
      selectedPackageHours,
      selectedLicenceType,
      selectedTimeDays
    } = courseInfo
    let trainings = []
    const { postcode } = supplierData

    if (isFullLicence) {
      let tmp = bike_hire.split('_')
      tmp = tmp[tmp.length - 1]
      const bikeHire = `BIKE_TYPE_${selectedLicenceType}_${tmp}`.toUpperCase()
      trainings = selectedTimeDays.map(timeDay => ({
        selected_availability: timeDay,
        course_type: courseType.constant,
        full_licence_type: LICENCE_TYPES[selectedLicenceType],
        bike_type: bikeHire,
        supplier_id: supplierData.id,
        package_hours: selectedPackageHours
      }))
    } else {
      trainings = [
        {
          school_course_id: instantCourse && instantCourse.id,
          course_type: courseType.constant,
          bike_type: bike_hire,
          supplier_id: supplierData.id,
          requested_date: instantDate,
          requested_time: supplierData.instant_book
            ? instantCourse.time.substring(0, 5)
            : getStartTime(supplierData, instantDate)
        }
      ]
      if (instantCourse) {
        trainings[0].school_course_id = instantCourse.id
      }
    }

    window.sessionStorage.setItem('trainings', JSON.stringify(trainings))

    // const next = `/${supplierData.supplier_slug}/checkout`
    let next

    if (isFullLicence) {
      next = `/course-addons/?postcode=${postcode}&courseType=${courseType.constant}&bike_hire=${bike_hire}&supplierId=${supplierData.id}`
    } else if (supplierData.instant_book) {
      if (instantCourse) {
        next = `/course-addons/?postcode=${postcode}&courseType=${courseType.constant}&bike_hire=${bike_hire}&courseId=${instantCourse.id}&supplierId=${supplierData.id}&date=${instantDate}`
      }
    } else {
      next = `/course-addons/?postcode=${postcode}&courseType=${courseType.constant}&bike_hire=${bike_hire}&supplierId=${supplierData.id}&date=${instantDate}`
    }

    let checkoutData = {
      postcode,
      courseType: courseType.constant,
      bike_hire,
      supplierId: supplierData.id,
      addons: [],
      gloves_jacket_included: supplierData.gloves_jacket_included,
      helmet_hire: supplierData.helmet_hire
    }

    if (courseType.constant !== 'FULL_LICENCE') {
      checkoutData.date = instantDate
    }

    if (supplierData.instant_book && instantCourse) {
      checkoutData.courseId = instantCourse.id
    }

    sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData))
    sessionStorage.setItem('login-next', JSON.stringify(next))
    window.location = next
  }

  const handleBackClick = () => {
    setCourseInfo({
      ...courseInfo,
      showDayOfWeekPicker: false,
      selectedTimeDays: []
    })
  }

  const renderRidetoButton = (
    bookNowDisabled,
    instantDate,
    instantCourse,
    bike_hire,
    isFullLicence,
    showDayOfWeekPicker
  ) => {
    return (
      <div className={styles.actionButton}>
        {showDayOfWeekPicker && (
          <button onClick={handleBackClick} className={styles.backButton}>
            <img src={ArrowLeftGreen} alt="Back" title="Back" />
          </button>
        )}
        <RideToButton
          className={classnames(styles.action, styles.actionStatic)}
          onClick={() => {
            if (isFullLicence && bookNowDisabled) {
              setCourseInfo({ ...courseInfo, isErrored: true })
              setTimeout(() => {
                setCourseInfo({ ...courseInfo, isErrored: false })
              })

              if (!bike_hire) {
                flashDiv('choose-bike')
              }

              if (!courseInfo.selectedLicenceType) {
                flashDiv('choose-licence')
              }

              if (!courseInfo.selectedPackageHours) {
                flashDiv('choose-package')
                return
              }

              if (
                showDayOfWeekPicker &&
                courseInfo.selectedTimeDays.length < 1
              ) {
                flashDiv('choose-times')
                return
              }

              return
            }

            if (isFullLicence && !showDayOfWeekPicker) {
              setCourseInfo({
                ...courseInfo,
                isErrored: false,
                showDayOfWeekPicker: true
              })

              setTimeout(() => {
                bottomAnchor.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end'
                })
              }, 99)

              return
            }
            if (!bookNowDisabled) {
              setCourseInfo({
                ...courseInfo,
                isErrored: false
              })
              onBookNow()
            } else if (!isFullLicence) {
              let chooseTimeDiv = document.getElementById(
                'choose-time-validate'
              )

              if (!instantDate) {
                flashDiv('choose-date')
              }
              if (!instantCourse && chooseTimeDiv) {
                flashDiv('choose-time-validate')
              } else if (!bike_hire) {
                flashDiv('choose-bike')
              }
            }
          }}>
          <span>{isFullLicence ? 'CONTINUE' : 'BOOK THIS COURSE'}</span>
          <img src={ButtonArrowWhite} alt="arrow" />
        </RideToButton>
        <div ref={bottomAnchor}></div>
      </div>
    )
  }

  const timeDayChange = ({ time, day, status }) => {
    const { selectedTimeDays } = courseInfo
    const dayTime = `${day}_${time}`

    if (status) {
      setCourseInfo({
        ...courseInfo,
        selectedTimeDays: [...selectedTimeDays, dayTime]
      })
    } else {
      setCourseInfo({
        ...courseInfo,
        selectedTimeDays: selectedTimeDays.filter(
          timeDay => timeDay !== dayTime
        )
      })
    }
  }

  let totalCost = ''
  if (!isFullLicence) {
    totalCost = (parseInt(supplierData.price) / 100).toFixed(2)
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
      {!isFullLicence ? (
        <CourseAvailabilityComponent
          fromSupplier
          course={supplierData}
          courseType={courseType.constant}
          date={date}
          instantCourse={courseInfo.instantCourse}
          instantDate={courseInfo.instantDate}
          bike_hire={courseInfo.bike_hire}
          onUpdate={onUpdate}
        />
      ) : (
        <CourseAvailabilityComponentFullLicence
          fromSupplier
          course={supplierData}
          bike_hire={courseInfo.bike_hire}
          onUpdate={onUpdate}
          onSelectPackage={onSelectPackage}
          selectedLicenceType={courseInfo.selectedLicenceType}
          selectedPackageHours={courseInfo.selectedPackageHours}
          showDayOfWeekPicker={courseInfo.showDayOfWeekPicker}
          timeDayChange={timeDayChange}
          selectedTimeDays={courseInfo.selectedTimeDays}
          isErrored={courseInfo.isErrored}
        />
      )}
      {!isFullLicence && (
        <div className={styles.priceLine}>
          <h5>TOTAL COST</h5>
          <span>£{totalCost}</span>
        </div>
      )}
      {renderRidetoButton(
        bookNowDisabled,
        courseInfo.instantDate,
        courseInfo.instantCourse,
        courseInfo.bike_hire,
        isFullLicence,
        courseInfo.showDayOfWeekPicker
      )}
    </React.Fragment>
  )
}

export default SupplierCourseDetail
