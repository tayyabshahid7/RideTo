import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import { getDasBikeTypes } from 'services/course'
import ToggleQuiz from 'components/RideTo/ResultPage/CourseDetailPanel/ToggleQuiz'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'
import DayOfWeekPicker from 'components/RideTo/ResultPage/CourseDetailPanel/DayOfWeekPicker'
import classnames from 'classnames'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import FullLicencePayment from 'components/RideTo/ResultPage/CourseDetailPanel/FullLicencePayment'
import HelpForm from 'components/RideTo/ResultPage/CourseDetailPanel/HelpForm'

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
      formCompleted: false
    }

    this.updateState = this.updateState.bind(this)
  }

  async componentDidMount() {
    const { id } = this.props.course
    const { automatic, manual } = await getDasBikeTypes(id)

    this.setState({
      loading: false,
      hasAutoBikes: Object.values(automatic).includes(true),
      hasManualBikes: Object.values(manual).includes(true),
      autoLicences: Object.keys(automatic).filter(key => automatic[key]),
      manualLicences: Object.keys(manual).filter(key => manual[key])
    })
  }

  updateState(state) {
    this.setState(state)
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
      selectedTimeDays
    } = this.props
    const {
      loading,
      hasAutoBikes,
      hasManualBikes,
      autoLicences,
      manualLicences,
      needsHelp,
      formCompleted
    } = this.state

    const included = {
      'What will I learn?':
        'Aute in ut ad culpa ullamco voluptate officia consectetur sed enim incididunt irure fugiat laboris.',
      "What's included?": <OrderIncluded fullLicence isWidget={isWidget} />,
      'What can I ride after?':
        'Aute in ut ad culpa ullamco voluptate officia consectetur sed enim incididunt irure fugiat laboris.'
    }

    return (
      <div
        className={classnames(
          styles.fullLicenceAvailability,
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
              and test dates which work for you.
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
            />
            {needsHelp === true && (
              <HelpForm
                onUpdate={onUpdate}
                updateContainerState={this.updateState}
              />
            )}
            {needsHelp === false || (needsHelp === true && formCompleted) ? (
              <Fragment>
                <BikePicker
                  needsHelp={needsHelp}
                  isWidget={isWidget}
                  isFullLicence
                  bike_hire={bike_hire}
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
                      bike_hire === 'manual' ? manualLicences : autoLicences
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
            <div className={styles.subtitle1} style={{ textAlign: 'center' }}>
              Your Availability
            </div>
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Select the times you can train on, the more flexible the sooner
              you can train.
            </p>
            <DayOfWeekPicker
              isWidget={isWidget}
              timeDayChange={timeDayChange}
              selectedTimeDays={selectedTimeDays}
            />
          </Fragment>
        )}
        <hr
          style={{ marginTop: 'calc(2.5rem - 1px)', marginBottom: '0.5rem' }}
        />
        <FullLicencePayment
          pricePerHour={course.price}
          hours={selectedPackageHours}
        />
      </div>
    )
  }
}

export default CourseAvailabilityComponentFullLicence
