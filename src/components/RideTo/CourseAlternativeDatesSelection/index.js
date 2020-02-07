import React from 'react'
import classnames from 'classnames'
import { getStaticData } from 'services/page'
import styles from './CourseAlternativeDatesSelection.scss'
import AlternativeLocationsOption from './AlternativeLocationsOption'
import { updateSchoolTrainingRejectionWithAlternativeDates } from 'services/course'
import moment from 'moment'
const rideToMinimalGreenImg =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/rideToMinimalGreen.jpg'

const Header = ({ userName }) => {
  const HeaderText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>{`Hey ${userName}, unfortunately, the data you requested is no longer available with the instructor.`}</p>
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

const AlternativeDatesOption = ({
  index,
  alternativeDates,
  courseId,
  onClick
}) => {
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
        {alternativeDates.map(date => {
          return (
            <div
              className={styles.alternativeDateLink}
              onClick={() => onClick(date)}
              key={date}>
              {moment(date).format('dddd, Do MMMM')}
            </div>
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
      clicked: false,
      courses: {},
      courseType: null,
      courseTypes: null,
      alternativeDates: [],
      courseId: null,
      userName: '',
      signature: '',
      selectedCourse: null,
      loading: true,
      showDateSelectorModal: false,
      activeTab: 3,
      instantCourse: null,
      instantDate: null,
      bike_hire: null,
      supplier: null,
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

  selectedDate = async date => {
    if (!this.state.clicked) {
      this.setState({ clicked: true }, async () => {
        try {
          await updateSchoolTrainingRejectionWithAlternativeDates(
            {
              date: date
            },
            this.state.courseId
          )
          window.location = `/training_rejection/${this.state.signature}/${this.state.courseId}/confirmation/`
        } catch (error) {
          alert('failed')
          console.log(error)
        }
        this.setState({ clicked: false })
      })
    }
  }

  componentDidMount() {
    const context = getStaticData('RIDETO_PAGE')
    const userName = context.firstName
    const courseType = context.courseType
    const courseTypes = context.courseTypes
    const courseId = context.friendlyId
    const signature = context.signature
    const supplier = context.supplier
    const alternativeDates = JSON.parse(
      context.alternativeDates.replace(/'/g, '"')
    )['dates']
    const courses = JSON.parse(context.courses)

    const loading = false

    this.setState({
      userName,
      signature,
      supplier,
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
      courseId,
      courseType,
      courseTypes,
      signature
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
                onClick={this.selectedDate}
                alternativeDates={alternativeDates}
                courseId={courseId}
              />

              <AlternativeLocationsOption
                index={2}
                userName={userName}
                courseType={courseType}
                courseTypes={courseTypes}
                courseId={courseId}
                courses={courses}
                signature={signature}
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
