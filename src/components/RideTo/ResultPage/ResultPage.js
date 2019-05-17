import React, { Component } from 'react'
import moment from 'moment'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Container, Row, Col } from 'reactstrap'
import { SortByOptions, getTitleFor } from 'common/info'
import { LICENCE_TYPES } from 'common/constants'
import DesktopHeader from './DesktopHeader'
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
import { parseQueryString } from 'services/api'
import classnames from 'classnames'
import { fetchCoursesTypes } from 'services/course-type'
import { isEqual } from 'lodash'
import { isBankHoliday } from 'services/misc'
import {
  getCourseTitle,
  getCourseIdFromSearch,
  findResultsCourseWithId
} from 'services/course'
import { Redirect } from 'react-router-dom'
import { setParam, deleteParam } from 'utils/helper'

class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCourse: null,
      loading: false,
      showDateSelectorModal: false,
      activeTab: 3,
      instantCourse: null,
      instantDate: null,
      bike_hire: null,
      selectedLicenceType: null,
      courseTypesOptions: [],
      selectedPackageHours: null,
      showDayOfWeekPicker: false,
      selectedTimeDays: [],
      initialLoaded: false,
      addCourseIdParam: false,
      removeCourseIdParam: false,
      noRedirect: false
    }

    this.onSelectPackage = this.onSelectPackage.bind(this)
    this.onBookNow = this.onBookNow.bind(this)
    this.handlePostcodeChange = this.handlePostcodeChange.bind(this)
    this.handleCourseChange = this.handleCourseChange.bind(this)
    this.handleDetailClick = this.handleDetailClick.bind(this)
    this.handlePriceClick = this.handlePriceClick.bind(this)
    this.handleReviewClick = this.handleReviewClick.bind(this)
    this.handleMobileDateClick = this.handleMobileDateClick.bind(this)
    this.timeDayChange = this.timeDayChange.bind(this)
    this.handleDissmiss = this.handleDissmiss.bind(this)

    window.sessionStorage.removeItem('trainings')
  }

  async componentDidMount() {
    // Prevent the reuslts from loading half way down the page
    if ('scrollRestoration' in window) {
      window.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const { postcode } = this.props
    const result = await fetchCoursesTypes(postcode || '')
    const courseTypes = result.results
    this.setState({
      courseTypesOptions: courseTypes.filter(
        courseType => courseType.constant !== 'TFL_ONE_ON_ONE'
      )
    })
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
    const { pathname } = window.location
    let postcode = ''
    let actualCourseType = ''
    if (pathname.startsWith('/cbt-training/')) {
      postcode = pathname.replace('/cbt-training/', '')
      actualCourseType = 'LICENCE_CBT'
    } else if (pathname.startsWith('/motorcycle-licence/')) {
      postcode = pathname.replace('/motorcycle-licence/', '')
      actualCourseType = 'FULL_LICENCE'
    } else if (qs.postcode) {
      postcode = qs.postcode.toUpperCase()
      actualCourseType = qs.courseType ? qs.courseType : 'LICENCE_CBT'
    } else {
      actualCourseType = qs.courseType ? qs.courseType : 'LICENCE_CBT'
    }
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

  onSelectPackage(hours) {
    this.onUpdate({
      selectedPackageHours: hours
    })
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  timeDayChange({ time, day, status }) {
    const { selectedTimeDays } = this.state
    const dayTime = `${day}_${time}`

    if (status) {
      this.setState({
        selectedTimeDays: [...selectedTimeDays, dayTime]
      })
    } else {
      this.setState({
        selectedTimeDays: selectedTimeDays.filter(
          timeDay => timeDay !== dayTime
        )
      })
    }
  }

  getStartTime(course, selectedDate) {
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

  onBookNow() {
    const {
      selectedCourse,
      instantCourse,
      instantDate,
      bike_hire,
      selectedPackageHours,
      selectedLicenceType,
      selectedTimeDays
    } = this.state
    const { postcode, courseType } = this.props
    let trainings = []

    if (!selectedCourse) {
      return
    }
    if (courseType === 'FULL_LICENCE') {
      trainings = selectedTimeDays.map(timeDay => ({
        selected_availability: timeDay,
        course_type: courseType,
        full_licence_type: LICENCE_TYPES[selectedLicenceType],
        bike_type: bike_hire,
        supplier_id: selectedCourse.id,
        package_hours: selectedPackageHours
      }))
    } else {
      trainings = [
        {
          school_course_id: instantCourse && instantCourse.id,
          course_type: courseType,
          bike_type: bike_hire,
          supplier_id: selectedCourse.id,
          requested_date: instantDate,
          requested_time: selectedCourse.instant_book
            ? instantCourse.time.substring(0, 5)
            : this.getStartTime(selectedCourse, instantDate)
        }
      ]
      if (instantCourse) {
        trainings[0].school_course_id = instantCourse.id
      }
    }

    window.sessionStorage.setItem('trainings', JSON.stringify(trainings))

    const next = `/${selectedCourse.supplier_slug}/checkout`

    let checkoutData = {
      postcode,
      courseType,
      bike_hire,
      supplierId: selectedCourse.id,
      addons: [],
      gloves_jacket_included: selectedCourse.gloves_jacket_included
    }

    if (courseType !== 'FULL_LICENCE') {
      checkoutData.date = instantDate
    }

    if (selectedCourse.instant_book && instantCourse) {
      checkoutData.courseId = instantCourse.id
    }

    sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData))
    sessionStorage.setItem('login-next', JSON.stringify(next))
    window.location = next
  }

  renderSortByDropdown(shortOptions) {
    const { handeUpdateOption, sortByOption, courseType } = this.props
    return (
      <UncontrolledDropdown className={styles.sortButtonWrap}>
        <DropdownToggle caret color="lightgrey" className={styles.sortButton}>
          {!shortOptions
            ? getTitleFor(SortByOptions, sortByOption).toUpperCase()
            : getTitleFor(SortByOptions, sortByOption).replace('Sort by', '')}
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
                {!shortOptions
                  ? sortOption.title.toUpperCase()
                  : sortOption.title.replace('Sort by', '')}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }

  handleMobileDateClick() {
    this.setState({ showDateSelectorModal: true })
  }

  renderRidetoButton(
    bookNowDisabled,
    instantDate,
    instantCourse,
    bike_hire,
    isFullLicence,
    showDayOfWeekPicker
  ) {
    return (
      <RideToButton
        className={classnames(
          styles.action,
          bookNowDisabled &&
            this.state.activeTab === 3 &&
            isFullLicence &&
            styles.bookNowDisabled,
          this.state.activeTab === 3 && styles.actionStatic
        )}
        onClick={() => {
          if (this.state.activeTab !== 3) {
            this.setState({ activeTab: 3 })
          } else {
            if (isFullLicence && !showDayOfWeekPicker) {
              this.setState({ showDayOfWeekPicker: true })
              return
            }
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
        <span>{isFullLicence ? 'CONTINUE' : 'SELECT'}</span>
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

  componentDidUpdate(prevProps, prevState) {
    const courseId = getCourseIdFromSearch(this.props.location.search)

    // Reset param changing state
    if (this.state.addCourseIdParam || this.state.removeCourseIdParam) {
      this.setState({
        addCourseIdParam: false,
        removeCourseIdParam: false
      })
    }

    if (this.state.noRedirect) {
      this.setState({
        noRedirect: false
      })
      return
    }

    // On initial page load, open the sidebar if courseId is set as param
    if (this.props.courses && !this.state.initialLoaded) {
      if (courseId) {
        this.setState({
          selectedCourse: findResultsCourseWithId(this.props.courses, courseId),
          activeTab: 3,
          instantDate: this.props.date,
          initialLoaded: true
        })
        return
      }
      this.setState({
        initialLoaded: true
      })
      return
    }

    const prevCourseId = getCourseIdFromSearch(prevProps.location.search)

    // If the selectedCourse changes
    if (
      this.state.initialLoaded &&
      !isEqual(this.state.selectedCourse, prevState.selectedCourse)
    ) {
      // If we need to close sidebar
      if (this.state.selectedCourse === null) {
        this.setState({
          removeCourseIdParam: true
        })
        return
      }

      // If we need to open the sidebar
      if (
        this.state.selectedCourse.id !==
        getCourseIdFromSearch(this.props.location.search)
      ) {
        this.setState({
          addCourseIdParam: true
        })
        return
      }

      return
    }

    // if courseId changes
    if (courseId !== prevCourseId) {
      if (courseId === null && this.state.selectedCourse !== null) {
        this.handleDissmiss()
        this.setState({
          noRedirect: true
        })
      }
      if (courseId && this.state.selectedCourse === null) {
        this.setState({
          selectedCourse: findResultsCourseWithId(this.props.courses, courseId)
        })
      }
    }
  }

  handleDissmiss() {
    this.setState({
      selectedCourse: null,
      instantCourse: null,
      bike_hire: null,
      selectedLicenceType: null,
      selectedPackageHours: null,
      showDayOfWeekPicker: false
    })
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
      sortByOption,
      location: { pathname, search }
    } = this.props
    const {
      selectedCourse,
      showDateSelectorModal,
      activeTab,
      instantCourse,
      instantDate,
      bike_hire,
      selectedLicenceType,
      selectedPackageHours,
      courseTypesOptions,
      showDayOfWeekPicker,
      selectedTimeDays,
      addCourseIdParam,
      removeCourseIdParam,
      noRedirect
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

    if (
      isFullLicence &&
      bike_hire &&
      selectedLicenceType &&
      selectedPackageHours
    ) {
      bookNowDisabled = false
    }

    if (showDayOfWeekPicker && selectedTimeDays.length < 1) {
      bookNowDisabled = true
    }

    let resultsCount = 0

    if (courses) {
      const unavailableCount = courses.unavailable
        ? courses.unavailable.length
        : 0
      resultsCount = courses.available.length + unavailableCount
    }

    if (addCourseIdParam) {
      return (
        <Redirect
          push
          to={{
            pathname,
            search: setParam(search, 'courseId', selectedCourse.id)
          }}
        />
      )
    }

    if (removeCourseIdParam) {
      return (
        <Redirect
          push={!noRedirect}
          to={{ pathname, search: deleteParam(search, 'courseId') }}
        />
      )
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
          date={date}
          showDatePicker
          handleMobileDateClick={this.handleMobileDateClick}
          courseTypesOptions={courseTypesOptions}
        />
        <DesktopHeader
          courseType={courseType}
          postcode={postcode}
          courseTypesOptions={courseTypesOptions}
          handlePostcodeChange={this.handlePostcodeChange}
          handleCourseChange={this.handleCourseChange}
        />
        <Container className={styles.pageContainer}>
          {hasPartnerResults && (
            <Row>
              <Col md="6">
                {!isFullLicence ? (
                  <React.Fragment>
                    <div className={styles.headingDesktop}>Choose a Date</div>
                    <div className={styles.headingMobile}>
                      {getCourseTitle(courseType)} {postcode}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className={styles.headingMobile}>
                    Motorcycle Licence {postcode}
                  </div>
                )}
                {!loading && (
                  <div
                    className={classnames(
                      styles.schoolCount,
                      styles.schoolCountMobile
                    )}>
                    {resultsCount} training sites sorted by{' '}
                    {this.renderSortByDropdown(true)}
                    <span className={styles.desktopSortByValue}>
                      {sortByOption.replace('-', '')}
                    </span>
                  </div>
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
                      {!loading && (
                        <React.Fragment>
                          <div className={classnames(styles.instruction)}>
                            Select a location
                          </div>
                          <div
                            className={classnames(
                              styles.schoolCount,
                              styles.schoolCountDesktop
                            )}>
                            {resultsCount} training sites sorted by{' '}
                            <span className={styles.desktopSortByValue}>
                              {sortByOption.replace('-', '')}
                            </span>
                          </div>
                        </React.Fragment>
                      )}
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
                            {courses.available.map(
                              (course, index) =>
                                course.is_partner && (
                                  <CourseItem
                                    showCallMessage={
                                      index === 2 ||
                                      (courses.available.length < 3 &&
                                        index === courses.available.length - 1)
                                    }
                                    courseType={courseType}
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
                                  showCallMessage={
                                    index === 2 ||
                                    (courses.unavailable.length < 3 &&
                                      index === courses.unavailable.length - 1)
                                  }
                                  courseType={courseType}
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
                            width="100%"
                            hiddenOnMobile
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
          onDismiss={this.handleDissmiss}
          footer={this.renderRidetoButton(
            bookNowDisabled,
            instantDate,
            instantCourse,
            bike_hire,
            isFullLicence,
            showDayOfWeekPicker
          )}
          footerStatic={activeTab === 3}>
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
              selectedLicenceType={selectedLicenceType}
              selectedPackageHours={selectedPackageHours}
              showDayOfWeekPicker={showDayOfWeekPicker}
              timeDayChange={this.timeDayChange}
              selectedTimeDays={selectedTimeDays}
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
