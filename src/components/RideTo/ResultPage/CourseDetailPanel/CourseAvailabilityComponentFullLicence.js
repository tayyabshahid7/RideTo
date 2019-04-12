import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import { getDasBikeTypes } from 'services/course'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'
import DayOfWeekPicker from 'components/RideTo/ResultPage/CourseDetailPanel/DayOfWeekPicker'
import classnames from 'classnames'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'

class CourseAvailabilityComponentFullLicence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      hasAutoBikes: false,
      hasManualBikes: false,
      autoLicences: [],
      manualLicences: []
    }
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
      manualLicences
    } = this.state

    return (
      <div
        className={classnames(
          styles.fullLicenceAvailability,
          !isWidget ? styles.content : styles.widget
        )}>
        {!showDayOfWeekPicker ? (
          <Fragment>
            {!isWidget && (
              <div className={styles.subtitle1}>Select a package</div>
            )}
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Select the right package for your riding ambitions. The instructor
              will be in touch within 24 hours to book your training and test
              dates which work for you.
            </p>
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Included as standard:
            </p>
            <OrderIncluded fullLicence />
            <BikePicker
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
                isWidget={isWidget}
                selectedLicenceType={selectedLicenceType}
                onUpdate={onUpdate}
                licences={
                  bike_hire === 'manual' ? manualLicences : autoLicences
                }
              />
              <PackagePicker
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
        ) : (
          <Fragment>
            <div className={styles.subtitle1}>Your Availability</div>
            <p
              className={classnames(
                styles.dasInfo,
                isWidget && styles.dasInfoWidget
              )}>
              Select the times which you can train on, the more flexible, the
              sooner you can train
            </p>
            <DayOfWeekPicker
              timeDayChange={timeDayChange}
              selectedTimeDays={selectedTimeDays}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

export default CourseAvailabilityComponentFullLicence
