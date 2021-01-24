import React, { useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import styles from './CourseTypeList.scss'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import { normalizePostCode } from 'utils/helper'
import { getFilters } from 'services/course-type'

const isTypeform = courseType => {
  if (courseType === 'TFL_ONE_ON_ONE') {
    return true
  } else {
    return false
  }
}

const getBookUrl = (courseType, postcode) => {
  const normalizedPostCode = normalizePostCode(postcode)

  if (courseType === 'TFL_ONE_ON_ONE') {
    return 'https://rideto.typeform.com/to/axybpw'
  } else {
    return `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType}`
  }
}

const filters = getFilters()

const CourseTypeList = ({ courseTypes, postcode, onLinkClick, onDetail }) => {
  const [selectedFilter, setSelectedFilters] = useState({
    tag: 'ALL',
    name: 'All'
  })
  const [filteredCourseTypes, setFilteredCourseTypes] = useState([])

  useEffect(() => {
    setFilteredCourseTypes(courseTypes)
  }, [courseTypes])

  const handleSelectFilter = value => {
    const filteredTypes =
      value && value.tag !== 'ALL'
        ? courseTypes.filter(({ tags }) => tags.indexOf(value.tag) > -1)
        : courseTypes
    setSelectedFilters(value)
    setFilteredCourseTypes(filteredTypes)
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm={{ size: 4, offset: 8 }} className={styles.filtersTitle}>
          Filter Courses
        </Col>
      </Row>
      <Row className={styles.filters}>
        <Col sm="6">
          <h2 className={styles.heading}>Choose a Course</h2>
        </Col>
        <Col sm="6">
          <CourseTypeSelectionFilters
            filters={filters}
            selected={selectedFilter}
            onSelect={handleSelectFilter}
          />
        </Col>
      </Row>
      <Row>
        {filteredCourseTypes.map(courseType => (
          <Col md="6" lg="4" key={courseType.name}>
            <CourseTypeItem
              isTypeform={isTypeform(courseType.constant)}
              courseType={courseType}
              onClickDetails={onDetail}
              onLinkClick={onLinkClick}
              url={getBookUrl(courseType.constant, postcode)}
            />
          </Col>
        ))}
      </Row>
    </React.Fragment>
  )
}

export default CourseTypeList
