/* TODO:

Discuss endpoint to be hit on load:
-courses
-courseType
-AlternativeDates:
- date
-url
-userName
-courseId

Figure out what to do about following click events on course Items:
- clicked details
-clicked reviews

Discuss endpoints to be hit on submit:
- alternative dates
-alternative locations

Adjust style:
-fonts
-spacing
*/
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import isEqual from 'lodash/isEqual'
import { SortByOptions, getTitleFor } from 'common/info'
import React from 'react'
import { LICENCE_TYPES } from 'common/constants'
import { getCourseIdFromSearch } from 'services/course'
import { isBankHoliday } from 'services/misc'
import classnames from 'classnames'
import { getStaticData, flashDiv } from 'services/page'
import ArrowLeftGreen from 'assets/images/rideto/ArrowLeftGreen.svg'
import styles from './CourseAlternativeDatesSelection.scss'
import rideToMinimalGreenImg from 'assets/images/rideToMinimalGreen.jpg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import CourseItem from '../ResultPage/CourseItem'
import CourseDetailPanel from '../ResultPage/CourseDetailPanel'
import RideToButton from 'components/RideTo/Button'
import { fetchSingleRidetoCourse } from 'services/course'
import moment from 'moment'
import SidePanel from 'components/RideTo/SidePanel'

const Header = ({ userName }) => {
  const HeaderText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>{`Hey ${userName}, unfortunately the data you requested is no longer available with the instructor.`}</p>
        <p>
          This happens sometimes when they have received multiple bookings at
          the same time or can no longer offer the date. Not to worry! We have
          some options for you:
        </p>
      </div>
    )
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerLogoWrapper}>
        <img
          className={styles.headerLogo}
          src={rideToMinimalGreenImg}
          alt="rideto logo green"
        />
      </div>

      <HeaderText userName={userName} />
    </div>
  )
}

const AlternativeDatesOption = ({ index, alternativeDates, courseId }) => {
  return (
    <div
      className={classnames(
        styles.alternativeDatesOption,
        styles.optionWrapper
      )}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. Alternative dates:</span>
        </h5>

        <p className={styles.optionSupTitle}>
          The Instructor offered the below alternative dates. Click to accept
          one of these:
        </p>
      </div>

      <div className={styles.optionContent}>
        {alternativeDates.map(({ date, url }) => {
          return (
            <a className={styles.alternativeDateLink} href={url} key={date}>
              {date}
            </a>
          )
        })}
      </div>

      <div className={styles.optionFooter}>
        <strong>There are also other dates available,</strong> drop us an email
        to{' '}
        <a
          href={`mailto:hello@rideto.com?Subject=Order#RT${courseId}%20-%20Course%20dates%20unavailable`}>
          hello@rideto.com
        </a>{' '}
        and quote your order reference RT#{courseId}. A member of the team will
        be able to find an alternative date at this location which works for
        you.
      </div>
    </div>
  )
}
const AlternativeLocationsOption = ({
  index,
  courses,
  courseType,
  handleDetailClick,
  handlePriceClick,
  handleReviewClick
}) => {
  return (
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
                handleDetailClick(course)
              }}
              handlePriceClick={handlePriceClick}
              handleReviewClick={handleReviewClick}
            />
          )
        })}
      </div>
    </div>
  )
}
const ContactUsOption = ({ index, courseId }) => {
  return (
    <div className={classnames(styles.contactUsOption, styles.optionWrapper)}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. None of the above working for you?</span>
        </h5>

        <p className={styles.optionSupTitle}>
          Drop us an email to{' '}
          <a
            href={`mailto:hello@rideto.com?Subject=Order#RT${courseId}%20-%20Course%20dates%20unavailable`}>
            hello@rideto.com
          </a>{' '}
          and quote your order reference RT#{courseId}. A member of the team
          will be able to find an alternative date at this location which works
          for you.
        </p>
      </div>
    </div>
  )
}
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
    const context = getStaticData('RIDETO_PAGE')
    const userName = context.firstName
    const courseType = context.courseType
    const courseTypes = context.courseTypes
    const courseId = context.friendlyId
    const alternativeDates = [
      { date: 'Sunday', url: 'https://www.google.com' },
      { date: 'Monday', url: 'https://www.google.com' },
      { date: 'Tuesday', url: 'https://www.google.com' }
    ]
    const courses = [
      {
        id: 44,
        is_partner: true,
        image_thumbnail:
          '/media/Supplier/ipass-osterley/Motorcycle-Training-London-Osterley-CBT-Training-RideTo-c.jpg',
        image:
          '/media/Supplier/ipass-osterley/Motorcycle-Training-London-Osterley-CBT-Training-RideTo-c.jpg',
        location_slug: 'hounslow',
        place: 'Indian Gymkhana Club, Osterley',
        postcode: 'TW7 4NQ',
        mciac_approved: false,
        bike_hire: true,
        helmet_hire: true,
        gloves_jacket_included: true,
        on_site_cafe: false,
        indoor_classroom: true,
        instant_book: true,
        distance_miles: 2.27211407159883,
        rating: 4.6,
        number_of_reviews: 144,
        name: 'IPASS CBT Osterley',
        email: 'james+notification@rideto.com',
        lat: 51.48073,
        lng: -0.34851,
        date: null,
        is_available_on: true,
        price: 10999
      },
      {
        id: 689,
        is_partner: true,
        image_thumbnail:
          '/media/Supplier/heathrow-motorcycle-training/Heathrow-Motorcycle-Training-CBT-Test-west-London--1-1-a.jpg',
        image:
          '/media/Supplier/heathrow-motorcycle-training/Heathrow-Motorcycle-Training-CBT-Test-west-London--1-1-a.jpg',
        location_slug: 'hounslow',
        place: 'Feltham & Hanworth Airparks Leisure, Hanworth, London',
        postcode: 'TW13 5EG',
        mciac_approved: false,
        bike_hire: true,
        helmet_hire: true,
        gloves_jacket_included: false,
        on_site_cafe: false,
        indoor_classroom: false,
        instant_book: true,
        distance_miles: 2.879460403944683,
        rating: 4.6,
        number_of_reviews: 64,
        name: 'Heathrow Motorcycle Training',
        email: 'james+notification@rideto.com',
        lat: 51.441285,
        lng: -0.390585,
        date: null,
        is_available_on: true,
        price: 11599
      },
      {
        id: 995,
        is_partner: true,
        image_thumbnail:
          '/media/Supplier/west-london-motorcycle-training/CBT-Training-West-London-RideTo-3.jpg',
        image:
          '/media/Supplier/west-london-motorcycle-training/CBT-Training-West-London-RideTo-3.jpg',
        location_slug: 'feltham',
        place: 'Fairholme School, Peacock Avenue,, Feltham',
        postcode: 'TW14 8ET',
        mciac_approved: false,
        bike_hire: true,
        helmet_hire: true,
        gloves_jacket_included: false,
        on_site_cafe: false,
        indoor_classroom: true,
        instant_book: false,
        distance_miles: 4.699913863559448,
        rating: 4.9,
        number_of_reviews: 172,
        name: 'West London Motorcycle Training',
        email: 'james+notification@rideto.com',
        lat: 51.448807,
        lng: -0.434689,
        date: null,
        is_available_on: true,
        price: 10999
      }
    ]
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
      alternativeDates,
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
    const { date } = this.props
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
      <div className={styles.container}>
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

        <div className={styles.content}>
          <Header userName={userName} />

          <div className={styles.body}>
            <div className={styles.optionsContainer}>
              <AlternativeDatesOption
                index={1}
                alternativeDates={alternativeDates}
                courseId={courseId}
              />

              <AlternativeLocationsOption
                index={2}
                courses={courses}
                handleDetailClick={this.handleDetailClick}
                handlePriceClick={this.handlePriceClick}
                handleReviewClick={this.handleReviewClick}
              />

              <ContactUsOption index={3} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CourseAlternativeDatesSelection
