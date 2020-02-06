import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import isEqual from 'lodash/isEqual'
import { SortByOptions, getTitleFor } from 'common/info'
import React, {Fragment} from 'react'
import { getCourseIdFromSearch } from 'services/course'
import { isBankHoliday } from 'services/misc'
import styles from './CourseAlternativeDatesSelection.scss'
import classnames from 'classnames'
import { getStaticData, flashDiv } from 'services/page'
import ArrowLeftGreen from 'assets/images/rideto/ArrowLeftGreen.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import CourseItem from '../ResultPage/CourseItem'
import CourseDetailPanel from '../ResultPage/CourseDetailPanel'
import RideToButton from 'components/RideTo/Button'
import { fetchSingleRidetoCourse, updateSchoolTrainingRejection } from 'services/course'
import moment from 'moment'
import SidePanel from 'components/RideTo/SidePanel'

class CourseAlternativeDatesSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      courses: {},
      courseType: null,
      courseTypes: null,
      alternativeDates: [],
      courseId: null,
      userName: '',
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
    const courseId = this.props.friendlyId
    const courses = this.props.courses



    const loading = false

    // Prevent the reuslts from loading half way down the page
    if ('scrollRestoration' in window) {
      window.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    this.setState({
      loading,
      userName,
      courseId,
      courseType,
      courseTypes,
      courses,
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
      courseId
    } = this.state


    let trainings = []

    if (!selectedCourse) {
      return
    }
    try{
      await updateSchoolTrainingRejection({
        bike_hire,
        supplier: selectedCourse.id,
        date: instantDate
      },courseId)
      alert('worked')
    }catch(error){
      console.log(error)
      alert('failed')
    }
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


        const {date, index} = this.props
        const {
          courseType,
          loading,
          userName,
          courses,
          alternativeDates,
          courseId,
          selectedCourse,
          activeTab,
          instantCourse,
          instantDate,
          bike_hire,
          selectedLicenceType,
          selectedPackageHours,
          showDayOfWeekPicker,
          selectedTimeDays,
          isErrored
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
                  <span>{index}. Other instant book locations:</span>
                </h5>

                <p className={styles.optionSupTitle}>
                  In your area we also have the below instant book locations. These are
                  live instructor diaries, so you're guaranteed to get the space shown.
                  Click to move your booking to one of these instructors. Any price
                  difference will be automatically refunded or charged.
                </p>
              </div>

              <div className={styles.optionContent}>
                {courses.map(course => {
                  return (
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
                      />
                  )
                })}
              </div>
            </div>
          </Fragment>
        )
      }
    }

    export default CourseAlternativeDatesSelection
