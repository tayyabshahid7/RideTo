import React, { useState } from 'react'
import loadable from '@loadable/component'
import SupplierInfo from './SupplierInfo'
import SupplierExtraInfo from './SupplierExtraInfo'
import CourseTypeList from 'components/RideTo/CourseTypeList'
import { SupplierContext } from './supplier-context'
import styles from './styles.scss'
import { useMediaQuery } from 'react-responsive'

const SidePanel = loadable(() => import('components/RideTo/SidePanel'))
const CourseTypeDetails = loadable(() =>
  import('components/RideTo/CourseTypeDetails')
)

const supplierData = window.RIDETO_PAGE.supplier.supplier
let supplier = Object.assign({}, supplierData)
const courseTypes = window.RIDETO_PAGE.courseTypes.filter(x => {
  const course = supplier.courses.find(c => c.constant === x.constant)
  if (!course) {
    return false
  }

  const courseInfo = supplier.courses_info.find(c => c.course === course.id)
  if (
    !courseInfo ||
    (course.constant === 'FULL_LICENCE' &&
      (!courseInfo.price ||
        isNaN(courseInfo.price) ||
        !parseFloat(courseInfo.price)))
  ) {
    return false
  }
  return true
})

supplier.instant_book = window.RIDETO_PAGE.supplier.instant_book

window.isSupplier = true

let defualtCourse = courseTypes.find(x => x.constant === 'LICENCE_CBT')
if (!defualtCourse) {
  defualtCourse = courseTypes[0]
}

const SupplierPage = () => {
  const [course, setCourse] = useState(defualtCourse)
  const [infoCourse, setInfoCourse] = useState(null)
  const [showExtraPanel, setShowExtraPanel] = useState(false)
  const [showCourseInfo, setShowCourseInfo] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1200 })

  if (!supplier.publish_supplier_page || !courseTypes.length) {
    window.location.pathname = '/'
    return null
  }

  const onDetail = value => {
    setInfoCourse(value)
    setShowCourseInfo(true)
  }

  const onCourseClick = value => {
    setCourse(value)
    if (isDesktop) {
      const courseEl = document.getElementById('supplier-course-slider')
      courseEl.scrollIntoView({ behavior: 'smooth' })
    }
    setShowExtraPanel(true)
  }

  return (
    <SupplierContext.Provider value={{ supplier, courseTypes }}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <SupplierInfo onShowExtra={() => setShowExtraPanel(true)} />
        </div>
        {isDesktop && (
          <div className={styles.rightContent}>
            <SupplierExtraInfo course={course} />
          </div>
        )}
        {!isDesktop && showExtraPanel && (
          <SidePanel
            visible
            headingImage={supplier.image ? supplier.image : ''}
            onDismiss={() => setShowExtraPanel(false)}>
            <SupplierExtraInfo course={course} />
          </SidePanel>
        )}
        <div className={styles.courseList}>
          <CourseTypeList
            courseTypes={courseTypes}
            onDetail={onDetail}
            onLinkClick={onCourseClick}
            postcode={''}
          />
        </div>
        {showCourseInfo && (
          <SidePanel
            visible
            headingImage={infoCourse.details && infoCourse.details.image}
            onDismiss={() => setShowCourseInfo(false)}>
            <CourseTypeDetails courseType={infoCourse} opened={() => {}} />
          </SidePanel>
        )}
      </div>
    </SupplierContext.Provider>
  )
}

export default SupplierPage
