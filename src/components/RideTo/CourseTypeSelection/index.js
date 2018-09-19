import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes, getFilters } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import SidePanel from 'components/RideTo/SidePanel'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'

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
    this.state = {
      filteredCourseTypes: [],
      selectedFilter: null,
      postcode: qs.postcode || '',
      selectedCourseType: null
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: this.state.postcode
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

    this.handleSelectFilter = this.handleSelectFilter.bind(this)
    this.handleNavigation = this.handleNavigation.bind(this)
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
    const filteredCourseTypes = selectedFilter
      ? this.courseTypes.filter(
          ({ tags }) => tags.indexOf(selectedFilter.tag) > -1
        )
      : this.courseTypes

    this.setState({
      selectedFilter,
      filteredCourseTypes
    })
  }

  handleNavigation(index) {}

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
      detailsImage
    } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavClick={this.handleNavigation}
        />
        <Container>
          <Row className={styles.filters}>
            <Col sm="6">
              <h2 className={styles.heading}>Choose Course</h2>
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
          visible={selectedCourseType !== null}
          headingImage={detailsImage}
          onDismiss={() => this.handleDetails(null)}>
          {selectedCourseType && (
            <CourseTypeDetails
              courseType={selectedCourseType}
              url={getBookUrl(selectedCourseType, postcode)}
            />
          )}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default CourseTypeSelection
