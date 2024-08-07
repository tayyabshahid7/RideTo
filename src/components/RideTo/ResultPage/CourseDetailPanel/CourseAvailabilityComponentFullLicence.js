import classnames from 'classnames'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import DayOfWeekPicker from 'components/RideTo/ResultPage/CourseDetailPanel/DayOfWeekPicker'
import FullLicencePayment from 'components/RideTo/ResultPage/CourseDetailPanel/FullLicencePayment'
import HelpForm from 'components/RideTo/ResultPage/CourseDetailPanel/HelpForm'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'
import ToggleQuiz from 'components/RideTo/ResultPage/CourseDetailPanel/ToggleQuiz'
import React, { Component, Fragment } from 'react'
import { getDasBikeTypes } from 'services/course'
import { getCourseTypesData } from 'services/page'
import styles from './styles.scss'

class CourseAvailabilityComponentFullLicence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      hasAutoBikes: false,
      hasManualBikes: false,
      autoLicences: [],
      manualLicences: [],
      needsHelp: null,
      formCompleted: false,
      staticCourseDetails: getCourseTypesData().find(
        data => data.constant === 'FULL_LICENCE'
      ).details
    }

    this._isMounted = false

    this.updateState = this.updateState.bind(this)
  }

  async componentDidMount() {
    const { id } = this.props.course
    this._isMounted = true

    if (this._isMounted) {
      const { automatic, manual } = await getDasBikeTypes(id)

      if (this._isMounted) {
        this.setState({
          loading: false,
          hasAutoBikes: Object.values(automatic).includes(true),
          hasManualBikes: Object.values(manual).includes(true),
          autoLicences: Object.keys(automatic).filter(key => automatic[key]),
          manualLicences: Object.keys(manual).filter(key => manual[key])
        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  updateState(state) {
    this.setState(state)
  }

  convertBikeHire = type => {
    if (!type) {
      return type
    }
    const tmp = type.split('_').slice(-1)[0]
    return 'BIKE_TYPE_' + tmp.toUpperCase()
  }

  render() {
    const {
      onUpdate,
      course,
      bike_hire,
      selectedLicenceType,
      selectedPackageDays,
      onSelectPackage,
      isWidget,
      selectedPackageHours,
      showDayOfWeekPicker,
      timeDayChange,
      selectedTimeDays,
      isErrored
    } = this.props
    const {
      loading,
      hasAutoBikes,
      hasManualBikes,
      autoLicences,
      manualLicences,
      needsHelp,
      formCompleted,
      staticCourseDetails
    } = this.state

    const included = {
      'What will I learn?': staticCourseDetails.learn,
      "What's included?": <OrderIncluded fullLicence isWidget={isWidget} />,
      'What can I ride after?': staticCourseDetails.ride_after
    }

    return (
      <div
        className={classnames(
          styles.fullLicenceAvailability,
          this.props.fromSupplier && 'px-0',
          !isWidget ? styles.content : styles.widget
        )}>
        {!showDayOfWeekPicker ? (
          <Fragment>
            {!isWidget && (
              <div className={styles.dasSubtitle}>
                Customise your training package
              </div>
            )}
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Customise the right package for your riding ambitions. The
              instructor will be in touch within 24 hours to book the training
              and test dates which work for you.{' '}
              {!isWidget && (
                <Fragment>
                  To discuss what course is right for you or paying on finance,{' '}
                  <a href="/contact">please get in touch</a>.
                </Fragment>
              )}
            </p>
            <CourseTypeDetails
              courseType={{ details: included }}
              minimal
              useKeysAsTitle
              titleStyle={{
                fontWeight: 500,
                marginBottom: '-10px'
              }}
              contentStyle={{
                opacity: 1,
                fontSize: '15px',
                lineHeight: '24px',
                textAlign: 'left'
              }}
            />
            <hr style={{ marginTop: '1.5rem', marginBottom: '1.75rem' }} />
            <ToggleQuiz
              isWidget={isWidget}
              updateState={this.updateState}
              needsHelp={needsHelp}
              onUpdate={onUpdate}
              isErrored={isErrored}
            />
            {needsHelp === true && (
              <HelpForm
                fromSupplier={this.props.fromSupplier}
                isErrored={isErrored}
                onUpdate={onUpdate}
                updateContainerState={this.updateState}
              />
            )}
            {needsHelp === true && formCompleted && (
              <Fragment>
                <hr style={{ marginTop: '2rem', marginBottom: '1.75rem' }} />
                <div
                  className={styles.dasSubtitle}
                  style={{ marginBottom: '-0.5rem' }}>
                  Here's our recommendation
                </div>
              </Fragment>
            )}
            {needsHelp === false || (needsHelp === true && formCompleted) ? (
              <Fragment>
                <BikePicker
                  needsHelp={needsHelp}
                  isWidget={isWidget}
                  isFullLicence
                  bike_hire={this.convertBikeHire(bike_hire)}
                  onUpdate={onUpdate}
                  course={course}
                  has_auto_bikes={hasAutoBikes}
                  has_manual_bikes={hasManualBikes}
                  loading={loading}
                />
                <Fragment>
                  <LicencePicker
                    needsHelp={needsHelp}
                    isWidget={isWidget}
                    selectedLicenceType={selectedLicenceType}
                    onUpdate={onUpdate}
                    licences={
                      bike_hire === 'manual' || bike_hire === 'BIKE_TYPE_MANUAL'
                        ? manualLicences
                        : autoLicences
                    }
                  />
                  <PackagePicker
                    needsHelp={needsHelp}
                    pricePerHour={course.price}
                    schoolId={course.id}
                    isWidget={isWidget}
                    bike_hire={bike_hire}
                    selectedLicenceType={selectedLicenceType}
                    selectedPackageDays={selectedPackageDays}
                    selectedPackageHours={selectedPackageHours}
                    onSelectPackage={onSelectPackage}
                  />
                </Fragment>
              </Fragment>
            ) : null}
          </Fragment>
        ) : (
          <Fragment>
            <div className={styles.dasSubtitle}>Your availability</div>
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Select the times you can train on, the more flexible the sooner
              you can train. Top instructors have busy schedules, so select as
              many slots as possible to get the best choice of dates.
            </p>
            <DayOfWeekPicker
              isWidget={isWidget}
              timeDayChange={timeDayChange}
              selectedTimeDays={selectedTimeDays}
            />
          </Fragment>
        )}
        {!showDayOfWeekPicker && !isWidget && (
          <Fragment>
            <hr
              style={{
                marginTop: 'calc(2.5rem - 1px)',
                marginBottom: '0.5rem'
              }}
            />
            <FullLicencePayment
              pricePerHour={course.price}
              hours={selectedPackageHours}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

export default CourseAvailabilityComponentFullLicence
