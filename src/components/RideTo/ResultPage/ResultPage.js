import React, { Component } from 'react'
import moment from 'moment'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Container, Row, Col } from 'reactstrap'
import { DAY_FORMAT5, LICENCE_TYPES } from 'common/constants'
import {
  SortByOptions,
  getTitleFor,
  getPackageDays,
  isAllPackageDatesSelected,
  isAnyPackageDatesSelected
} from 'common/info'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import styles from './ResultPage.scss'
import DateSelector from './DateSelector'
import CourseItem from './CourseItem'
import MapComponent from 'components/RideTo/MapComponent'
import CourseItemNonPartner from './CourseItemNonPartner'
import SidePanel from 'components/RideTo/SidePanel'
import CourseDetailPanel from './CourseDetailPanel'
import DateSelectorModal from './DateSelectorModal'
import RideToButton from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Loading from 'components/Loading'
import { IconCalendar } from 'assets/icons'
import { parseQueryString } from 'services/api'
import classnames from 'classnames'

class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCourse: null,
      loading: false,
      showDateSelectorModal: false,
      activeTab: 1,
      instantCourse: null,
      instantDate: null,
      bike_hire: null,
      selectedLicenceType: null,
      selectedPackageDays: '',
      selectedPackageDates: []
    }

    this.onSelectPackage = this.onSelectPackage.bind(this)
    this.onSelectPackageDate = this.onSelectPackageDate.bind(this)
    this.onBookNow = this.onBookNow.bind(this)
    this.handlePostcodeChange = this.handlePostcodeChange.bind(this)
    this.handleCourseChange = this.handleCourseChange.bind(this)
    this.handleDetailClick = this.handleDetailClick.bind(this)
    this.handlePriceClick = this.handlePriceClick.bind(this)
    this.handleReviewClick = this.handleReviewClick.bind(this)

    window.sessionStorage.removeItem('trainings')
  }

  componentDidMount() {
    // Prevent the reuslts from loading half way down the page
    if ('scrollRestoration' in window) {
      window.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }

  handleDetailClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: 1,
      instantDate: this.props.date
    })
  }

  handlePriceClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: 3,
      instantDate: this.props.date
    })
  }

  handleReviewClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: 2,
      instantDate: this.props.date
    })
  }

  handlePostcodeChange(newPostcode) {
    const qs = parseQueryString(window.location.search.slice(1))
    const actualPostcode = qs.postcode ? qs.postcode.toUpperCase() : ''
    const courseType = qs.courseType ? qs.courseType : 'LICENCE_CBT'
    if (actualPostcode !== newPostcode) {
      window.location = `/course-location/?postcode=${newPostcode}&courseType=${courseType}`
    }
  }

  handleCourseChange(newCourseType) {
    const qs = parseQueryString(window.location.search.slice(1))
    const postcode = qs.postcode ? qs.postcode.toUpperCase() : ''
    const actualCourseType = qs.courseType ? qs.courseType : 'LICENCE_CBT'
    if (actualCourseType !== newCourseType) {
      window.location = `/course-location/?postcode=${postcode}&courseType=${newCourseType}`
    }
  }

  onSelectDate(date) {
    const { handleSetDate } = this.props
    const { showDateSelectorModal } = this.state

    if (!showDateSelectorModal || !date) {
      return
    }

    handleSetDate(date)
    this.setState({ showDateSelectorModal: false })
  }

  onSelectPackage(days) {
    const packageDays = getPackageDays(days)

    this.onUpdate({
      selectedPackageDays: days,
      selectedPackageDates: packageDays
    })
  }

  onSelectPackageDate(index, { date, course_id, time }) {
    const newDates = [...this.state.selectedPackageDates]

    if (
      newDates[index + 1] &&
      newDates[index + 1].date !== '' &&
      !window.confirm('Changing this will unset subsequent dates')
    ) {
      return
    }

    newDates[index].course_id = course_id
    newDates[index].date = date
    newDates[index].time = time
    newDates.forEach((date, i) => {
      if (i > index) {
        date.course_id = null
        date.date = ''
        date.time = ''
      }
    })

    this.setState({
      selectedPackageDates: newDates
    })
  }

  onUpdate(data) {
    const { courseType } = this.props
    const { selectedPackageDates } = this.state

    if (
      courseType === 'FULL_LICENCE' &&
      (data.hasOwnProperty('bike_hire') ||
        data.hasOwnProperty('selectedLicenceType') ||
        data.hasOwnProperty('selectedPackageDays')) &&
      isAnyPackageDatesSelected(selectedPackageDates) &&
      !window.confirm('Changing this will unset any dates')
    ) {
      return
    }

    this.setState({ ...data })
  }

  onBookNow() {
    const {
      selectedCourse,
      instantCourse,
      instantDate,
      bike_hire,
      selectedPackageDates,
      selectedLicenceType
    } = this.state
    const { postcode, courseType } = this.props
    let trainings = []

    if (!selectedCourse) {
      return
    }

    if (courseType === 'FULL_LICENCE') {
      trainings = selectedPackageDates.map(training => {
        return {
          school_course_id: training.course_id,
          course_type: training.type,
          full_licence_type: LICENCE_TYPES[selectedLicenceType],
          bike_type: bike_hire,
          supplier_id: selectedCourse.id,
          requested_date: training.date,
          requested_time: training.time
        }
      })
    } else {
      trainings = [
        {
          school_course_id: instantCourse && instantCourse.id,
          course_type: courseType,
          bike_type: bike_hire,
          supplier_id: selectedCourse.id,
          requested_date: selectedCourse.date,
          requested_time: selectedCourse.startTime
        }
      ]

      if (instantCourse) {
        trainings[0].school_course_id = instantCourse.id
      }
    }

    window.sessionStorage.setItem('trainings', JSON.stringify(trainings))

    if (courseType === 'FULL_LICENCE') {
      window.location = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&supplierId=${
        selectedCourse.id
      }`
    } else if (selectedCourse.instant_book) {
      if (instantCourse) {
        window.location = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&courseId=${
          instantCourse.id
        }&supplierId=${selectedCourse.id}&date=${instantDate}`
      }
    } else {
      window.location = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&supplierId=${
        selectedCourse.id
      }&date=${instantDate}`
    }
  }

  renderSortByDropdown() {
    const { handeUpdateOption, sortByOption, courseType } = this.props
    return (
      <UncontrolledDropdown>
        <DropdownToggle caret color="lightgrey" className={styles.sortButton}>
          {getTitleFor(SortByOptions, sortByOption).toUpperCase()}
        </DropdownToggle>
        <DropdownMenu>
          {SortByOptions.map(sortOption => {
            if (courseType === 'FULL_LICENCE' && sortOption.value === 'price') {
              return false
            }
            return (
              <DropdownItem
                onClick={() =>
                  handeUpdateOption({ sortByOption: sortOption.value })
                }
                key={sortOption.value}>
                {sortOption.title.toUpperCase()}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  renderMobileDateSelectorButton() {
    const { date } = this.props

    return (
      <div
        className={styles.dateSelectorMobile}
        onClick={() => {
          this.setState({ showDateSelectorModal: true })
        }}>
        <span>{moment(date).format(DAY_FORMAT5)}</span>
        <span>
          <IconCalendar />
        </span>
      </div>
    )
  }

  renderRidetoButton(
    bookNowDisabled,
    instantDate,
    instantCourse,
    bike_hire,
    ifullLicence
  ) {
    const { selectedPackageDates } = this.state

    return (
      <RideToButton
        className={classnames(
          styles.action,
          bookNowDisabled && ifullLicence && styles.bookNowDisabled
        )}
        onClick={() => {
          isAllPackageDatesSelected(selectedPackageDates)
          if (this.state.activeTab !== 3) {
            this.setState({ activeTab: 3 })
          } else {
            if (!bookNowDisabled) {
              this.onBookNow()
            } else {
              let chooseTimeDiv = document.getElementById(
                'choose-time-validate'
              )

              if (!instantDate) {
                let chooseDateDiv = document.getElementById('choose-date')
                chooseDateDiv.classList.remove('highlight-required')
                chooseDateDiv.scrollIntoView()
                chooseDateDiv.classList.add('highlight-required')
              }
              if (!instantCourse && chooseTimeDiv) {
                chooseTimeDiv.classList.remove('highlight-required')
                chooseTimeDiv.scrollIntoView()
                chooseTimeDiv.classList.add('highlight-required')
              } else if (!bike_hire) {
                let bikeTypeDiv = document.getElementById('choose-bike')
                bikeTypeDiv.classList.remove('highlight-required')
                bikeTypeDiv.scrollIntoView()
                bikeTypeDiv.classList.add('highlight-required')
              }
            }
          }
        }}>
        <span>Select</span>
        <img src={ButtonArrowWhite} alt="arrow" />
      </RideToButton>
    )
  }

  checkPartnerResults(courses) {
    if (courses) {
      const availableCourses = courses.available.filter(
        course => course.is_partner
      )
      let unavailableCourses = []
      if (courses.unavailable) {
        unavailableCourses = courses.unavailable.filter(
          course => course.is_partner
        )
      } else {
        unavailableCourses = []
      }
      return availableCourses.length > 0 || unavailableCourses.length > 0
    }
    return true
  }

  render() {
    const {
      courses,
      courseType,
      postcode,
      date,
      handleSetDate,
      navigation,
      loading,
      userLocation,
      sortByOption
    } = this.props
    const {
      selectedCourse,
      showDateSelectorModal,
      activeTab,
      instantCourse,
      instantDate,
      bike_hire,
      selectedLicenceType,
      selectedPackageDays,
      selectedPackageDates
    } = this.state
    // const courseTitle = getCourseTitle(courseType)

    let bookNowDisabled = false
    if (selectedCourse) {
      bookNowDisabled =
        (selectedCourse.instant_book && !instantCourse) ||
        !bike_hire ||
        !instantDate
    }

    const hasPartnerResults = this.checkPartnerResults(courses)
    const isFullLicence = courseType === 'FULL_LICENCE'

    if (isFullLicence) {
      bookNowDisabled = true
    }

    if (isAllPackageDatesSelected(selectedPackageDates)) {
      bookNowDisabled = false
    }

    let resultsCount = 0

    if (courses) {
      const unavailableCount = courses.unavailable
        ? courses.unavailable.length
        : 0
      resultsCount = courses.available.length + unavailableCount
    }

    return (
      <div className={styles.container}>
        <NavigationComponent
          onPostcodeChange={postcode => {
            this.handlePostcodeChange(postcode)
          }}
          onCourseChange={course => {
            this.handleCourseChange(course)
          }}
          postcode={postcode}
          courseType={courseType}
          navigation={navigation}
        />
        <Container className={styles.pageContainer}>
          {hasPartnerResults && (
            <Row>
              <Col sm="6">
                {!isFullLicence ? (
                  <React.Fragment>
                    <div className={styles.headingDesktop}>Choose a Date</div>
                    <div className={styles.headingMobile}>
                      Choose a Date &amp; Location
                    </div>
                  </React.Fragment>
                ) : (
                  <div className={styles.headingMobile}>Choose a Location</div>
                )}
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Loading
                loading={loading}
                position="top"
                className={styles.contentWrapper}
                cover>
                <div className={styles.contentWrapperInner}>
                  {hasPartnerResults ? (
                    <React.Fragment>
                      {!isFullLicence && (
                        <DateSelector
                          date={date}
                          handleSetDate={handleSetDate}
                          className={styles.dateSelector}
                          courseType={courseType}
                        />
                      )}
                      <div className={styles.mobileButtons}>
                        {!isFullLicence &&
                          this.renderMobileDateSelectorButton()}
                        {this.renderSortByDropdown()}
                      </div>
                    </React.Fragment>
                  ) : (
                    <div className={styles.nonParnetResultMessage}>
                      We don't have any partner schools to book with in your
                      area, however feel free to use our directory to contact a
                      school near you.
                    </div>
                  )}

                  {courses ? (
                    <div
                      className={classnames(
                        styles.mainContent,
                        isFullLicence && styles.noMargin
                      )}>
                      <div className={styles.coursesPanel}>
                        {courses.available.length > 0 && (
                          <React.Fragment>
                            <div
                              className={classnames(
                                styles.subTitle,
                                styles.hiddenOnMobile
                              )}>
                              Choose a location
                            </div>
                            <div
                              className={classnames(
                                styles.schoolCount,
                                isFullLicence && styles.schoolCountFullLicence
                              )}>
                              {`Showing ${resultsCount} training sites in your area by ${sortByOption.replace(
                                '-',
                                ''
                              )}`}
                            </div>
                            {courses.available.map(
                              (course, index) =>
                                course.is_partner && (
                                  <CourseItem
                                    showCallMessage={index === 2}
                                    id={`card-course-${course.id}`}
                                    course={course}
                                    className={styles.courseSpacing}
                                    key={course.id}
                                    handleDetailClick={this.handleDetailClick}
                                    handlePriceClick={this.handlePriceClick}
                                    handleReviewClick={this.handleReviewClick}
                                  />
                                )
                            )}
                          </React.Fragment>
                        )}
                        {courses.unavailable && courses.unavailable.length > 0 && (
                          <React.Fragment>
                            {hasPartnerResults && (
                              <div className={styles.subTitle}>
                                Available on other dates
                              </div>
                            )}
                            {courses.unavailable.map((course, index) =>
                              course.is_partner ? (
                                <CourseItem
                                  showCallMessage={index === 2}
                                  id={`card-course-${course.id}`}
                                  unavaiableDate={true}
                                  course={course}
                                  className={styles.courseSpacing}
                                  key={course.id}
                                  handleDetailClick={this.handleDetailClick}
                                  handlePriceClick={this.handlePriceClick}
                                  handleReviewClick={this.handleReviewClick}
                                />
                              ) : (
                                <CourseItemNonPartner
                                  id={`card-course-${course.id}`}
                                  course={course}
                                  className="mt-3"
                                  key={course.id}
                                />
                              )
                            )}
                          </React.Fragment>
                        )}
                      </div>
                      <div className={styles.mapPanel}>
                        {hasPartnerResults && (
                          <div className={styles.buttonsWrapper}>
                            {this.renderSortByDropdown()}
                          </div>
                        )}
                        {courses && (
                          <MapComponent
                            className={styles.mapWrapper}
                            courses={courses}
                            userLocation={userLocation}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    !loading && (
                      <div className={styles.noResults}>
                        No results, please try another date.
                      </div>
                    )
                  )}
                </div>
              </Loading>
            </Col>
          </Row>
        </Container>

        <SidePanel
          className={styles.noPadding}
          visible={selectedCourse !== null}
          headingImage={selectedCourse ? selectedCourse.image : ''}
          onDismiss={() =>
            this.setState({
              selectedCourse: null,
              instantCourse: null,
              bike_hire: null,
              selectedLicenceType: null,
              selectedPackageDays: '',
              selectedPackageDates: []
            })
          }
          footer={this.renderRidetoButton(
            bookNowDisabled,
            instantDate,
            instantCourse,
            bike_hire,
            isFullLicence
          )}>
          {selectedCourse && (
            <CourseDetailPanel
              courseType={courseType}
              course={selectedCourse}
              activeTab={activeTab}
              onChangeTab={tab => this.setState({ activeTab: tab })}
              date={date}
              instantCourse={instantCourse}
              instantDate={instantDate}
              bike_hire={bike_hire}
              onUpdate={this.onUpdate.bind(this)}
              onSelectPackage={this.onSelectPackage}
              onSelectPackageDate={this.onSelectPackageDate}
              selectedLicenceType={selectedLicenceType}
              selectedPackageDays={selectedPackageDays}
              selectedPackageDates={selectedPackageDates}
            />
          )}
        </SidePanel>
        {showDateSelectorModal && !loading && (
          <DateSelectorModal
            isOpen={true}
            onClose={() => this.setState({ showDateSelectorModal: false })}
            date={date}
            onSelectDate={this.onSelectDate.bind(this)}
          />
        )}
      </div>
    )
  }
}

export default ResultPage
