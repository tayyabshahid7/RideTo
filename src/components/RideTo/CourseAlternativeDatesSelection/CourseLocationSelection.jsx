import ArrowLeftGreen from 'assets/images/rideto/ArrowLeftGreen.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import classnames from 'classnames'
import { getTitleFor, SortByOptions } from 'common/info'
import Loading from 'components/Loading'
import RideToButton from 'components/RideTo/Button'
import SidePanel from 'components/RideTo/SidePanel'
import moment from 'moment'
import React, { Fragment } from 'react'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import {
  fetchSingleRidetoCourse,
  updateSchoolTrainingRejectionWithAlternativeDates
} from 'services/course'
import { isBankHoliday } from 'services/misc'
import { flashDiv } from 'services/page'
import CourseDetailPanel from '../ResultPage/CourseDetailPanel'
import CourseItem from '../ResultPage/CourseItem'
import styles from './CourseAlternativeDatesSelection.scss'

class CourseLocationSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      clicked: false,
      course: {},
      courseType: null,
      courseTypes: null,
      alternativeDates: [],
      orderId: null,
      signature: '',
      userName: '',
      paymentType: '',
      trainingPrice: 0,
      bankHolidays: [],
      selectedCourse: null,
      loading: true,
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

  componentDidMount() {
    const userName = this.props.firstName
    const courseType = this.props.courseType
    const courseTypes = this.props.courseTypes
    const orderId = this.props.orderId
    const signature = this.props.signature
    const course = this.props.course
    const paymentType = this.props.paymentType
    const trainingPrice = this.props.trainingPrice
    const bankHolidays = this.props.bankHolidays

    const loading = false

    // Prevent the reuslts from loading half way down the page
    if ('scrollRestoration' in window) {
      window.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    this.setState({
      signature,
      loading,
      userName,
      orderId,
      courseType,
      courseTypes,
      course,
      paymentType,
      trainingPrice,
      bankHolidays,
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

  loadCourseDetail = async (course, activeTab, date = null) => {
    const selectedCourse = await fetchSingleRidetoCourse(course.id)
    selectedCourse.next_date_available = date || course.next_date_available

    this.setState({
      selectedCourse,
      activeTab: activeTab,
      instantDate: this.props.date
    })
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

  onBookNow = async () => {
    const {
      selectedCourse,
      instantDate,
      bike_hire,
      orderId,
      clicked
    } = this.state

    if (!selectedCourse || clicked) {
      return
    }

    this.setState({ clicked: true }, async () => {
      try {
        let parsedBikeType

        switch (bike_hire) {
          case 'BIKE_TYPE_AUTO':
          case 'auto':
          case 'Auto':
          case 'automatic':
          case 'Automatic':
          case 'Automatic Scooter':
            parsedBikeType = 'BIKE_TYPE_AUTO'
            break
          case 'AUTO_125CC':
          case 'BIKE_TYPE_AUTO_125CC':
          case 'BIKE_TYPE_BIKE_125CC':
          case 'Automatic 125cc Scooter':
            parsedBikeType = 'BIKE_TYPE_AUTO_125CC'
            break
          case 'AUTO_ELECTRIC':
          case 'BIKE_TYPE_AUTO_ELECTRIC':
            parsedBikeType = 'BIKE_TYPE_AUTO_ELECTRIC'
            break
          case 'BIKE_TYPE_MANUAL':
          case 'manual':
          case 'Manual':
          case 'Manual 125cc Motorcycle':
            parsedBikeType = 'BIKE_TYPE_MANUAL'
            break
          case 'MANUAL_50CC':
          case 'BIKE_TYPE_MANUAL_50CC':
          case 'Manual 50cc Motorcycle':
            parsedBikeType = 'BIKE_TYPE_MANUAL_50CC'
            break
          case 'BIKE_TYPE_NONE':
          case 'none':
          case 'no':
          case 'None':
          default:
            parsedBikeType = 'BIKE_TYPE_NONE'
            break
        }
        await updateSchoolTrainingRejectionWithAlternativeDates(
          {
            date: instantDate,
            bike_hire: parsedBikeType
          },
          orderId
        )
        window.location = `/training_rejection/${this.state.signature}/${this.state.orderId}/confirmation/`
      } catch (error) {
        const updated = { clicked: false, showError: false }
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          updated.showError = true
          updated.errorMessage = error.response.data.error
        }
        this.setState(updated, () => {
          flashDiv('error-message')
        })
      }
    })
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

  renderRidetoButton = (
    bookNowDisabled,
    instantDate,
    instantCourse,
    bike_hire,
    isFullLicence,
    showDayOfWeekPicker
  ) => {
    const { showError, errorMessage } = this.state

    return (
      <Loading
        loading={this.state.clicked}
        className={classnames(
          styles.alternativeLocationSelectButtonWrapper,
          this.state.activeTab === 3 && styles.visible
        )}>
        <React.Fragment>
          {showDayOfWeekPicker && (
            <button
              onClick={this.handleBackClick}
              className={styles.backButton}>
              <img src={ArrowLeftGreen} alt="Back" title="Back" />
            </button>
          )}
          {showError && (
            <div id="error-message" className={styles.errorMessage}>
              {errorMessage}
            </div>
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
            <span>{isFullLicence ? 'CONTINUE' : 'CONFIRM'}</span>
            <img src={ButtonArrowWhite} alt="arrow" />
          </RideToButton>
          <div ref={this.bottomAnchor}></div>
        </React.Fragment>
      </Loading>
    )
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
    const { date, index } = this.props
    const {
      courseType,
      loading,
      course,
      selectedCourse,
      activeTab,
      instantCourse,
      instantDate,
      bike_hire,
      selectedLicenceType,
      selectedPackageHours,
      showDayOfWeekPicker,
      selectedTimeDays,
      isErrored,
      paymentType,
      trainingPrice,
      bankHolidays
    } = this.state

    if (loading) return <div>Loading ...</div>

    let bookNowDisabled = false
    if (selectedCourse) {
      bookNowDisabled =
        (selectedCourse.instant_book && !instantCourse) ||
        !bike_hire ||
        !instantDate
    }

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

    return (
      <Fragment>
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
                paymentType={paymentType}
                trainingPrice={trainingPrice}
                bankHolidays={bankHolidays}
              />
            )}
          </SidePanel>
        )}
        <div
          className={classnames(
            styles.alternativeLocationsOption,
            styles.optionWrapper
          )}>
          <div className={styles.optionHeader}>
            <h5 className={styles.optionTitle}>
              <span>{index}. Alternative dates:</span>
            </h5>

            <p className={styles.optionSupTitle}>
              Your chosen instructor has updated their calendar with the latest
              available dates below. Please select a date which works for you.
            </p>
          </div>

          <div className={styles.optionContent}>
            <CourseItem
              courseType={courseType}
              showCallMessage={false}
              id={`card-course-${course.id}`}
              unavaiableDate={false}
              course={course}
              className={styles.alternativeLocationCourseItem}
              key={course.id}
              handleDetailClick={() => {
                this.handleDetailClick(course)
              }}
              handlePriceClick={this.handlePriceClick}
              handleReviewClick={this.handleReviewClick}
              handleNextAvailableClick={(course, date) => {
                this.loadCourseDetail(course, 3, date)
              }}
            />
          </div>
        </div>
      </Fragment>
    )
  }
}

export default CourseLocationSelection
