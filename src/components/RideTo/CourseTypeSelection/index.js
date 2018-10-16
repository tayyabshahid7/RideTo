import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes, getFilters } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import SidePanel from 'components/RideTo/SidePanel'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

import styles from './CourseTypeSelection.scss'

const getBookUrl = ({ constant }, postcode) => {
  return `/course-location/?postcode=${postcode}&courseType=${constant}`
}

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    const qs = parseQueryString(window.location.search.slice(1))

    this.filters = getFilters()
    this.courseTypes = []

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: qs.postcode ? qs.postcode.toUpperCase() : ''
      },
      {
        title: 'Course',
        subtitle: 'Choose a Course',
        active: true
      },
      {
        title: 'Date & Location',
        subtitle: '-',
        disabled: true
      },
      {
        title: 'Extras',
        disabled: true
      }
    ]

    this.state = {
      filteredCourseTypes: [],
      selectedFilter: { tag: 'ALL', name: 'All' },
      postcode: qs.postcode || '',
      selectedCourseType: null,
      navigation: this.navigation
    }

    this.handleSelectFilter = this.handleSelectFilter.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
  }

  async componentDidMount() {
    const { postcode } = this.state
    const result = await fetchCoursesTypes(postcode || '')
    this.courseTypes = result.results

    this.setState({
      filteredCourseTypes: this.courseTypes
    })
  }

  handleSelectFilter(selectedFilter) {
    const filteredCourseTypes =
      selectedFilter && selectedFilter.tag !== 'ALL'
        ? this.courseTypes.filter(
            ({ tags }) => tags.indexOf(selectedFilter.tag) > -1
          )
        : this.courseTypes

    this.setState({
      selectedFilter,
      filteredCourseTypes
    })
  }

  handleDetails(selectedCourseType) {
    this.setState({
      selectedCourseType,
      detailsImage: selectedCourseType ? selectedCourseType.details.image : null
    })
  }

  render() {
    const {
      postcode,
      filteredCourseTypes,
      selectedFilter,
      selectedCourseType,
      detailsImage,
      navigation
    } = this.state

    const footer = selectedCourseType ? (
      <Button
        href={getBookUrl(selectedCourseType, postcode)}
        className={styles.action}>
        <span>Book Now</span>
        <img src={ButtonArrowWhite} alt="arrow" />
      </Button>
    ) : null

    return (
      <React.Fragment>
        <NavigationComponent navigation={navigation} />
        <Container className={styles.container}>
          <Row>
            <Col sm={{ size: 12, offset: 8 }} className={styles.filtersTitle}>
              Filter Courses
            </Col>
          </Row>
          <Row className={styles.filters}>
            <Col sm="6">
              <h2 className={styles.heading}>Choose a Course</h2>
            </Col>
            <Col sm="6">
              <CourseTypeSelectionFilters
                filters={this.filters}
                selected={selectedFilter}
                onSelect={this.handleSelectFilter}
              />
            </Col>
          </Row>
          <Row>
            {filteredCourseTypes.map(courseType => (
              <Col sm="4" key={courseType.name}>
                <CourseTypeItem
                  courseType={courseType}
                  onClickDetails={this.handleDetails}
                  url={getBookUrl(courseType, postcode)}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <SidePanel
          footer={footer}
          visible={selectedCourseType !== null}
          headingImage={detailsImage}
          onDismiss={() => this.handleDetails(null)}>
          {selectedCourseType && (
            <CourseTypeDetails courseType={selectedCourseType} />
          )}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default CourseTypeSelection
