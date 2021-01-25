import React, { useState } from 'react'
import SupplierInfo from './SupplierInfo'
import SupplierExtraInfo from './SupplierExtraInfo'
import CourseTypeList from 'components/RideTo/CourseTypeList'
import styles from './styles.scss'

const supplier = window.RIDETO_PAGE.supplier.supplier
const typeList = supplier.courses.map(x => x.constant)
const courseTypes = window.RIDETO_PAGE.courseTypes.filter(x =>
  typeList.includes(x.constant)
)

let defualtCourse = courseTypes.find(x => x.constant === 'LICENCE_CBT')
if (!defualtCourse) {
  defualtCourse = courseTypes[0]
}

const SupplierPage = () => {
  const [course, setCourse] = useState(defualtCourse)

  const onDetail = value => {
    console.log(value)
  }

  const onCourseClick = value => {

    setCourse(value)
    const courseEl = document.getElementById('supplier-course-slider')
    courseEl.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <SupplierInfo />
      </div>
      <div className={styles.rightContent}>
        <SupplierExtraInfo courseTypes={courseTypes} course={course} />
      </div>
      <div className={styles.courseList}>
        <CourseTypeList
          courseTypes={courseTypes}
          onDetail={onDetail}
          onLinkClick={onCourseClick}
          postcode={''}
        />
      </div>
    </div>
  )
}

export default SupplierPage
