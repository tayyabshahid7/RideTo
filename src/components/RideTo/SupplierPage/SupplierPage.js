import React from 'react'
import SupplierInfo from './SupplierInfo'
import SupplierExtraInfo from './SupplierExtraInfo'
import CourseTypeList from 'components/RideTo/CourseTypeList'
import styles from './styles.scss'

const supplier = window.RIDETO_PAGE.supplier.supplier
const typeList = supplier.courses.map(x => x.constant)
const courseTypes = window.RIDETO_PAGE.courseTypes.filter(x =>
  typeList.includes(x.constant)
)

const SupplierPage = () => {
  const onDetail = value => {
    console.log(value)
  }

  const onCourseClick = value => {
    console.log(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <SupplierInfo />
      </div>
      <div className={styles.rightContent}>
        <SupplierExtraInfo />
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
