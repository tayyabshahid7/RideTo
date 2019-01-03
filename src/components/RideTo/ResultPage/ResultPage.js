import React, { Component } from 'react'
import moment from 'moment'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Container, Row, Col } from 'reactstrap'
import { DAY_FORMAT5 } from 'common/constants'
import { SortByOptions, getTitleFor } from 'common/info'
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
      activeTab: '1',
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
  }

  handleDetailClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: '1',
      instantDate: this.props.date
    })
  }

  handlePriceClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: '3',
      instantDate: this.props.date
    })
  }

  handleReviewClick(course) {
    this.setState({
      selectedCourse: course,
      activeTab: '2',
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
    handleSetDate(date)
    this.setState({ showDateSelectorModal: false })
  }

  onSelectPackage(days) {
    let dates = [
      { id: 'mod1Training1', title: 'Module 1 Training', date: '' },
      { id: 'mod1Test', title: 'Module 1 Test', date: '' },
      { id: 'mod2training1', title: 'Module 2 Training', date: '' },
      { id: 'mod2Test', title: 'Module 2 Test', date: '' }
    ]

    if (days === '5') {
      dates = [
        { id: 'mod1Training1', title: 'Module 1 Training', date: '' },
        { id: 'mod1Test', title: 'Module 1 Test', date: '' },
        { id: 'mod2training1', title: 'Module 2 Training', date: '' },
        { id: 'mod2training2', title: 'Module 2 Training', date: '' },
        { id: 'mod2Test', title: 'Module 2 Test', date: '' }
      ]
    }

    if (days === '6') {
      dates = [
        { id: 'mod1Training1', title: 'Module 1 Training', date: '' },
        { id: 'mod1Training2', title: 'Module 1 Training', date: '' },
        { id: 'mod1Test', title: 'Module 1 Test', date: '' },
        { id: 'mod2training1', title: 'Module 2 Training', date: '' },
        { id: 'mod2training2', title: 'Module 2 Training', date: '' },
        { id: 'mod2Test', title: 'Module 2 Test', date: '' }
      ]
    }

    this.setState({ selectedPackageDays: days, selectedPackageDates: dates })
  }

  onSelectPackageDate(index, selectedDate) {
    const newDates = [...this.state.selectedPackageDates]

    if (
      newDates[index + 1] &&
      newDates[index + 1].date !== '' &&
      !window.confirm('Changing this will unset subsequent dates')
    ) {
      return
    }

    newDates[index].date = selectedDate
    newDates.forEach((date, i) => {
      return i > index ? (date.date = '') : null
    })

    this.setState({
      selectedPackageDates: newDates
    })
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  onBookNow() {
    const { selectedCourse, instantCourse, instantDate, bike_hire } = this.state
    const { postcode, courseType } = this.props
    if (!selectedCourse) {
      return
    }
    if (selectedCourse.instant_book) {
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
        onClick={() => this.setState({ showDateSelectorModal: true })}>
        <span>{moment(date).format(DAY_FORMAT5)}</span>
        <span>
          <IconCalendar />
        </span>
      </div>
    )
  }

  renderRidetoButton(bookNowDisabled, instantDate, instantCourse, bike_hire) {
    return (
      <RideToButton
        className={styles.action}
        onClick={() => {
          if (this.state.activeTab !== '3') {
            this.setState({ activeTab: '3' })
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
        <span>Book Now</span>
        <img src={ButtonArrowWhite} alt="arrow" />
      </RideToButton>
    )
  }

  checkPartnerResults(courses) {
    if (courses) {
      const availableCourses = courses.available.filter(
        course => course.is_partner
      )
      const unavailableCourses = courses.unavailable.filter(
        course => course.is_partner
      )
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
      userLocation
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
                    {!isFullLicence && this.renderMobileDateSelectorButton()}
                    {this.renderSortByDropdown()}
                  </div>
                </React.Fragment>
              ) : (
                <div className={styles.nonParnetResultMessage}>
                  We don't have any partner schools to book with in your area,
                  however feel free to use our directory to contact a school
                  near you.
                </div>
              )}
              <Loading loading={loading} className={styles.contentWrapper}>
                {courses ? (
                  <div className={styles.mainContent}>
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
                          {courses.available.map(
                            course =>
                              course.is_partner && (
                                <CourseItem
                                  id={`card-course-${course.id}`}
                                  course={course}
                                  className={styles.courseSpacing}
                                  key={course.id}
                                  handleDetailClick={this.handleDetailClick.bind(
                                    this
                                  )}
                                  handlePriceClick={this.handlePriceClick.bind(
                                    this
                                  )}
                                  handleReviewClick={this.handleReviewClick.bind(
                                    this
                                  )}
                                />
                              )
                          )}
                        </React.Fragment>
                      )}
                      {courses.unavailable.length > 0 && (
                        <React.Fragment>
                          {hasPartnerResults && (
                            <div className={styles.subTitle}>
                              Available on other dates
                            </div>
                          )}
                          {courses.unavailable.map(course =>
                            course.is_partner ? (
                              <CourseItem
                                id={`card-course-${course.id}`}
                                unavaiableDate={true}
                                course={course}
                                className={styles.courseSpacing}
                                key={course.id}
                                handleDetailClick={this.handleDetailClick.bind(
                                  this
                                )}
                                handlePriceClick={this.handlePriceClick.bind(
                                  this
                                )}
                                handleReviewClick={this.handleReviewClick.bind(
                                  this
                                )}
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
              </Loading>
            </Col>
          </Row>
        </Container>

        <SidePanel
          className={styles.noPadding}
          visible={selectedCourse !== null}
          headingImage={selectedCourse ? selectedCourse.image : ''}
          onDismiss={() =>
            this.setState({ selectedCourse: null, instantCourse: null })
          }
          footer={this.renderRidetoButton(
            bookNowDisabled,
            instantDate,
            instantCourse,
            bike_hire
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
        {showDateSelectorModal && (
          <DateSelectorModal
            isOpen={true}
            onClose={() => this.setState({ showDateSelectorModal: false })}
            date={date}
            onSelect={this.onSelectDate.bind(this)}
          />
        )}
      </div>
    )
  }
}

export default ResultPage
