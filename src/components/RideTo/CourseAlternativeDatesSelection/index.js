import classnames from 'classnames'
import React, { Fragment } from 'react'
import { getStaticData } from 'services/page'
import AlternativeLocationsOption from './AlternativeLocationsOption'
import styles from './CourseAlternativeDatesSelection.scss'
import CourseLocationSelection from './CourseLocationSelection'

const rideToMinimalGreenImg =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/rideToMinimalGreen.jpg'

const Header = ({ userName, alreadyResponded }) => {
  const HeaderText = ({ userName, alreadyResponded }) => {
    return (
      <div className={styles.headerTextWrapper}>
        {alreadyResponded ? (
          <Fragment>
            <p className={styles.textCenter}>
              {`Hey ${userName},  we've received your response, please keep an eye on your emails for the updated details of your booking. In the meantime, why not check out our `}
              <a href="https://www.rideto.com/blog/category/guides">
                useful guides.
              </a>
            </p>
          </Fragment>
        ) : (
          <Fragment>
            <p>{`Hey ${userName}, unfortunately, the date you requested is no longer available with the instructor.`}</p>
            <p>
              This happens sometimes when they have received multiple bookings
              at the same time or can no longer offer the date. Not to worry! We
              have some options for you:
            </p>
          </Fragment>
        )}
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

      <HeaderText userName={userName} alreadyResponded={alreadyResponded} />
    </div>
  )
}

const ContactUsOption = ({ index, orderId }) => {
  return (
    <div className={classnames(styles.contactUsOption, styles.optionWrapper)}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. None of the above working for you?</span>
        </h5>

        <p className={styles.optionSupTitle}>
          Drop us an email to{' '}
          <a
            href={`mailto:hello@rideto.com?Subject=Order#RT${orderId}%20-%20Course%20dates%20unavailable`}>
            hello@rideto.com
          </a>{' '}
          and quote your order reference RT#{orderId}. A member of the team will
          be able to find an alternative date at this location which works for
          you.
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
      error: '',
      courses: {},
      supplierData: {},
      courseType: null,
      courseTypes: null,
      alternativeDates: [],
      orderId: null,
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

  componentDidMount() {
    const context = getStaticData('RIDETO_PAGE')
    const userName = context.firstName
    const courseType = context.courseType
    const courseTypes = context.courseTypes
    const orderId = context.friendlyId
    const signature = context.signature
    const supplier = context.supplier
    const alreadyResponded = context.already_responded !== 'False'

    const courses = context.courses ? JSON.parse(context.courses) : null

    const loading = false

    const supplierData = context.supplierData
      ? JSON.parse(context.supplierData)
      : null

    this.setState({
      userName,
      signature,
      supplier,
      alreadyResponded,
      courseType,
      courseTypes,
      orderId,
      courses,
      loading,
      supplierData
    })
  }

  render() {
    const {
      loading,
      userName,
      alreadyResponded,
      courses,
      orderId,
      courseType,
      courseTypes,
      signature,
      supplierData
    } = this.state

    if (loading) return <div>Loading ...</div>

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {alreadyResponded ? (
            <Fragment>
              <Header userName={userName} alreadyResponded />
            </Fragment>
          ) : (
            <Fragment>
              <Header userName={userName} />
              <div className={styles.body}>
                <div className={styles.optionsContainer}>
                  <CourseLocationSelection
                    index={1}
                    userName={userName}
                    courseType={courseType}
                    courseTypes={courseTypes}
                    orderId={orderId}
                    course={supplierData}
                    signature={signature}
                    handleDetailClick={this.handleDetailClick}
                    handlePriceClick={this.handlePriceClick}
                    handleReviewClick={this.handleReviewClick}
                  />

                  {courses && (
                    <AlternativeLocationsOption
                      index={2}
                      userName={userName}
                      courseType={courseType}
                      courseTypes={courseTypes}
                      orderId={orderId}
                      courses={courses}
                      signature={signature}
                      handleDetailClick={this.handleDetailClick}
                      handlePriceClick={this.handlePriceClick}
                      handleReviewClick={this.handleReviewClick}
                    />
                  )}

                  <ContactUsOption index={courses ? 3 : 2} courseId={orderId} />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default CourseAlternativeDatesSelection
