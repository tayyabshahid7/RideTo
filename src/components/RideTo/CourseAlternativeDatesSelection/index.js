import React from 'react'
import classnames from 'classnames'
import { getStaticData } from 'services/page'
import styles from './CourseAlternativeDatesSelection.scss'
import rideToMinimalGreenImg from 'assets/images/rideToMinimalGreen.jpg'
import AlternativeLocationsOption from './AlternativeLocationsOption'

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

    this.setState({
      userName,
      courseType,
      courseTypes,
      courseId,
      alternativeDates,
      courses,
      loading
    })
  }

  render() {
    const {
      loading,
      userName,
      courses,
      alternativeDates,
      courseId
    } = this.state

    if (loading) return <div>Loading ...</div>

    return (
      <div className={styles.container}>
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
