import React, { Component } from 'react'
import moment from 'moment'
import ArrowLeftGreen from 'assets/images/rideto/ArrowLeftGreen.svg'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Container, Row, Col } from 'reactstrap'
import { SortByOptions, getTitleFor } from 'common/info'
import { LICENCE_TYPES } from 'common/constants'
import ResultsHeader from './ResultsHeader'
import styles from './ResultPage.scss'
import DateSelector from './DateSelector'
import CourseItem from './CourseItem'
import RideToButton from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Loading from 'components/Loading'
import { parseQueryString } from 'services/api'
import classnames from 'classnames'
import { fetchCoursesTypes } from 'services/course-type'
import isEqual from 'lodash/isEqual'
import { isBankHoliday } from 'services/misc'
import { getCourseIdFromSearch } from 'services/course'
import { Redirect } from 'react-router-dom'
import { setParam, deleteParam } from 'utils/helper'
import { getStaticData, flashDiv } from 'services/page'
import POMBanner from './POMBanner'
import loadable from '@loadable/component'
import MediaQuery from 'react-responsive'
import { fetchSingleRidetoCourse } from 'services/course'

const MapComponent = loadable(() => import('components/RideTo/MapComponent'))
const DateSelectorModal = loadable(() => import('./DateSelectorModal'))

const FullLicenceGuide = loadable(() => import('./FullLicenceGuide'))
const FullLicenceIncluded = loadable(() => import('./FullLicenceIncluded'))
const FullLicenceFaq = loadable(() => import('./FullLicenceFaq'))
const FullLicenceBanner = loadable(() => import('./FullLicenceBanner'))

const SidePanel = loadable(() => import('components/RideTo/SidePanel'))
const CourseTypeDetails = loadable(() =>
  import('components/RideTo/CourseTypeDetails')
)
const CourseDetailPanel = loadable(() => import('./CourseDetailPanel'))

const CourseItemNonPartner = loadable(() => import('./CourseItemNonPartner'))

const MobileMap = loadable(() => import('./MobileMap'))

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
      noRedirect: false,
      isShowCourseTypeInfo: false,
      isErrored: false,
      formCompletedWithoutTheory: false,
      isMobileMapVisible: false
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

    this.showCourseTypeInfo = this.showCourseTypeInfo.bind(this)
    this.hideCourseTypeInfo = this.hideCourseTypeInfo.bind(this)
    this.handleBackClick = this.handleBackClick.bind(this)
    this.handleCloseMap = this.handleCloseMap.bind(this)

    window.sessionStorage.removeItem('trainings')

    this.bottomAnchor = React.createRef()
  }

  handleBackClick() {
    this.setState({
      showDayOfWeekPicker: false,
      selectedTimeDays: []
    })
  }

  showCourseTypeInfo() {
    this.setState({
      isShowCourseTypeInfo: true
    })
  }

  hideCourseTypeInfo() {
    this.setState({
      isShowCourseTypeInfo: false
    })
  }

  async componentDidMount() {
    // Prevent the reuslts from loading half way down the page
    if ('scrollRestoration' in window) {
      window.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const { postcode, courseType } = this.props
    const result = await fetchCoursesTypes(postcode || '')
    const courseTypes = result.results.filter(
      courseType => courseType.constant !== 'TFL_ONE_ON_ONE'
    )
    const { courseTypes: staticCourseTypes } = getStaticData('RIDETO_PAGE')

    // If there are no courseTypes for this area just throw in all the course
    // course types for the 'non partner results' page
    if (courseTypes.length === 0) {
      this.setState({
        courseTypesOptions: staticCourseTypes,
        selectedCourseType: staticCourseTypes.find(
          course => course.constant === this.props.courseType
        )
      })
      return
    }

    if (
      courseTypes.length &&
      !courseTypes.some(
        courseTypeOption => courseTypeOption.constant === courseType
      )
    ) {
      this.handleCourseChange(courseTypes[0].constant)
      return
    }

    this.setState({
      courseTypesOptions: courseTypes,
      selectedCourseType: courseTypes.find(
        course => course.constant === this.props.courseType
      )
    })
  }

  async handleDetailClick(course) {
    const selectedCourse = await fetchSingleRidetoCourse(course.id)

    this.setState({
      selectedCourse,
      activeTab: 1,
      instantDate: this.props.date
    })
  }

  async handlePriceClick(course) {
    const selectedCourse = await fetchSingleRidetoCourse(course.id)

    this.setState({
      selectedCourse,
      activeTab: 3,
      instantDate: this.props.date
    })
  }

  async handleReviewClick(course) {
    const selectedCourse = await fetchSingleRidetoCourse(course.id)

    this.setState({
      selectedCourse,
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
    const { courseType } = this.props
    const { instantDate } = this.state

    this.setState({ ...data })

    if (instantDate && data.bike_hire && courseType !== 'FULL_LICENCE') {
      setTimeout(() => {
        this.bottomAnchor.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 99)
    }
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

    // const next = `/${selectedCourse.supplier_slug}/checkout`
    let next

    if (courseType === 'FULL_LICENCE') {
      next = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&supplierId=${selectedCourse.id}`
    } else if (selectedCourse.instant_book) {
      if (instantCourse) {
        next = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&courseId=${instantCourse.id}&supplierId=${selectedCourse.id}&date=${instantDate}`
      }
    } else {
      next = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&supplierId=${selectedCourse.id}&date=${instantDate}`
    }

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
      <React.Fragment>
        {showDayOfWeekPicker && (
          <button onClick={this.handleBackClick} className={styles.backButton}>
            <img src={ArrowLeftGreen} alt="Back" title="Back" />
          </button>
        )}
        <RideToButton
          className={classnames(
            styles.action,
            this.state.activeTab === 3 && styles.actionStatic
          )}
          onClick={() => {
            if (this.state.activeTab !== 3) {
              this.setState({ activeTab: 3 })
            } else {
              if (isFullLicence && bookNowDisabled) {
                this.setState(
                  {
                    isErrored: true
                  },
                  () => {
                    this.setState({
                      isErrored: false
                    })
                  }
                )

                // if (this.state.formCompletedWithoutTheory) {
                //   flashDiv('choose-both')
                // }

                if (!bike_hire) {
                  flashDiv('choose-bike')
                }

                if (!this.state.selectedLicenceType) {
                  flashDiv('choose-licence')
                }

                if (!this.state.selectedPackageHours) {
                  flashDiv('choose-package')
                  return
                }

                if (
                  showDayOfWeekPicker &&
                  this.state.selectedTimeDays.length < 1
                ) {
                  flashDiv('choose-times')
                  return
                }

                return
              }

              if (isFullLicence && !showDayOfWeekPicker) {
                this.setState({ isErrored: false, showDayOfWeekPicker: true })
                return
              }
              if (!bookNowDisabled) {
                this.setState({
                  isErrored: false
                })
                this.onBookNow()
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
            }
          }}>
          <span>{isFullLicence ? 'CONTINUE' : 'SELECT'}</span>
          <img src={ButtonArrowWhite} alt="arrow" />
        </RideToButton>
        <div ref={this.bottomAnchor}></div>
      </React.Fragment>
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

  async componentDidUpdate(prevProps, prevState) {
    if (!this.props.courses) {
      return
    }

    const courseId = getCourseIdFromSearch(this.props.location.search)

    if (!isEqual(this.state.instantCourse, prevState.instantCourse)) {
      const isAutoFull =
        this.state.instantCourse &&
        this.state.instantCourse.auto_count >=
          this.state.instantCourse.auto_bikes
      const isManualFull =
        this.state.instantCourse &&
        this.state.instantCourse.manual_count >=
          this.state.instantCourse.manual_bikes

      if (this.state.bike_hire === 'auto' && isAutoFull) {
        this.setState({
          bike_hire: null
        })
      } else if (this.state.bike_hire === 'manual' && isManualFull) {
        this.setState({
          bike_hire: null
        })
      }
    }

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
    if (!this.state.initialLoaded) {
      if (courseId) {
        const selectedCourse = await fetchSingleRidetoCourse(courseId)

        this.setState({
          selectedCourse,
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
        const selectedCourse = await fetchSingleRidetoCourse(courseId)

        this.setState({
          selectedCourse
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
      showDayOfWeekPicker: false,
      instantDate: null
    })
  }

  handleCloseMap() {
    this.setState({
      isMobileMapVisible: false
    })
  }

  render() {
    const {
      courses,
      courseType,
      postcode,
      date,
      handleSetDate,
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
      noRedirect,
      isShowCourseTypeInfo,
      selectedCourseType,
      isErrored,
      isMobileMapVisible
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
    const hasPOM = ['LICENCE_CBT_RENEWAL', 'LICENCE_CBT'].includes(courseType)

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

    // Don't need theory for now
    // if (formCompletedWithoutTheory) {
    //   bookNowDisabled = true
    // }

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
        <ResultsHeader
          courseType={courseType}
          postcode={postcode}
          date={date}
          courseTypesOptions={courseTypesOptions}
          handlePostcodeChange={this.handlePostcodeChange}
          handleCourseChange={this.handleCourseChange}
          handleMobileDateClick={this.handleMobileDateClick}
          isFullLicence={isFullLicence}
          showCourseTypeInfo={this.showCourseTypeInfo}
        />
        <Container className={styles.pageContainer}>
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
                        <React.Fragment>
                          <div
                            className={classnames(
                              styles.instruction,
                              styles.instructionDate
                            )}>
                            Choose a date
                          </div>
                          <DateSelector
                            date={date}
                            handleSetDate={handleSetDate}
                            className={styles.dateSelector}
                            courseType={courseType}
                          />
                        </React.Fragment>
                      )}
                      {!loading && (
                        <React.Fragment>
                          <MediaQuery query="(min-width: 769px)">
                            <div
                              className={classnames(
                                styles.instruction,
                                isFullLicence && styles.instructionFullLicence
                              )}>
                              <span>Select a location</span>
                              <button
                                id="results-mobile-map-button"
                                className={styles.showMap}
                                onClick={() => {
                                  this.setState({
                                    isMobileMapVisible: !isMobileMapVisible
                                  })
                                }}>
                                <i className="fas fa-map-marker-alt"></i> Map
                              </button>
                            </div>
                            <div className={classnames(styles.schoolCount)}>
                              {resultsCount} training sites sorted by{' '}
                              {this.renderSortByDropdown(true)}
                              <span className={styles.desktopSortByValue}>
                                {sortByOption.replace('-', '')}
                              </span>
                            </div>
                          </MediaQuery>
                          <MediaQuery query="(max-width: 768px)">
                            <div
                              className={classnames(
                                styles.instruction,
                                isFullLicence && styles.instructionFullLicence
                              )}>
                              <div className={classnames(styles.schoolCount)}>
                                <span>{resultsCount} Results by </span>
                                {this.renderSortByDropdown(true)}
                                <i class="fas fa-caret-down"></i>
                                <span className={styles.desktopSortByValue}>
                                  {sortByOption.replace('-', '')}
                                </span>
                              </div>
                              <button
                                id="results-mobile-map-button"
                                className={styles.showMap}
                                onClick={() => {
                                  this.setState({
                                    isMobileMapVisible: !isMobileMapVisible
                                  })
                                }}>
                                Map View
                              </button>
                            </div>
                          </MediaQuery>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <div className={styles.nonPartnerResultsMessage}>
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
                        <MediaQuery query="(min-width: 769px)">
                          {hasPOM && hasPartnerResults && <POMBanner />}
                        </MediaQuery>
                        {isFullLicence && (
                          <FullLicenceBanner
                            className={styles.fastTrackAdvert}
                            href="https://rideto.typeform.com/to/CvduD4"
                          />
                        )}
                        {courses.available.length > 0 && (
                          <React.Fragment>
                            {courses.available.map(
                              (course, index) =>
                                course.is_partner && (
                                  <CourseItem
                                    showCallMessage={
                                      index === 1 ||
                                      (index - 1) % 5 === 0 ||
                                      (courses.available.length < 3 &&
                                        index === courses.available.length - 1)
                                    }
                                    showPomMessage={
                                      courseType === 'LICENCE_CBT' &&
                                      index === 3
                                    }
                                    courseType={courseType}
                                    id={`card-course-${course.id}`}
                                    course={course}
                                    className={styles.courseSpacing}
                                    key={course.id}
                                    showCourseTypeInfo={this.showCourseTypeInfo}
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
                        {!hasPartnerResults && courses.available.length > 0 && (
                          <React.Fragment>
                            {courses.available.map(
                              (course, index) =>
                                !course.is_partner && (
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
                        {courses && userLocation && (
                          <MediaQuery minWidth={769}>
                            <MapComponent
                              className={styles.mapWrapper}
                              courses={courses}
                              userLocation={userLocation}
                              width="100%"
                              hiddenOnMobile
                            />
                          </MediaQuery>
                        )}
                      </div>
                    </div>
                  ) : (
                    !loading && (
                      <div className={styles.noResults}>
                        No results, try another location or course
                      </div>
                    )
                  )}
                </div>
              </Loading>
            </Col>
          </Row>
        </Container>

        {isFullLicence && <FullLicenceGuide />}

        {isFullLicence && <FullLicenceIncluded />}

        {isFullLicence && <FullLicenceFaq />}

        <MediaQuery maxWidth={768}>
          {isMobileMapVisible && courses && userLocation && (
            <MobileMap handleCloseMap={this.handleCloseMap}>
              <MapComponent
                courses={courses}
                userLocation={userLocation}
                width="100%"
                hiddenOnMobile
                handlePinClick={this.handlePriceClick}
              />
            </MobileMap>
          )}
        </MediaQuery>

        {isShowCourseTypeInfo && (
          <SidePanel
            visible
            headingImage={selectedCourseType.details.image}
            onDismiss={this.hideCourseTypeInfo}>
            <CourseTypeDetails courseType={selectedCourseType} />
          </SidePanel>
        )}

        {selectedCourse && (
          <SidePanel
            mountUnmount
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
                isErrored={isErrored}
              />
            )}
          </SidePanel>
        )}
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
