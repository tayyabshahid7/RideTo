import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import { getDasBikeTypes } from 'services/course'
import { getPackageStartDate } from 'common/info'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'
import FullLicenceDatePicker from 'components/RideTo/ResultPage/CourseDetailPanel/FullLicenceDatePicker'

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
      onSelectPackageDate,
      selectedPackageDates,
      isWidget
    } = this.props
    const {
      loading,
      hasAutoBikes,
      hasManualBikes,
      autoLicences,
      manualLicences
    } = this.state

    return (
      <div className={!isWidget ? styles.content : styles.widget}>
        {!isWidget && (
          <div className={styles.subtitle1}>Full Licence (A1/A2 DAS)</div>
        )}
        <p className={styles.dasInfo}>
          DAS courses take place over multiple days.
        </p>

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

        {bike_hire && (
          <Fragment>
            <LicencePicker
              isWidget={isWidget}
              selectedLicenceType={selectedLicenceType}
              onUpdate={onUpdate}
              licences={bike_hire === 'auto' ? autoLicences : manualLicences}
            />
            <PackagePicker
              isWidget={isWidget}
              bike_hire={bike_hire}
              selectedLicenceType={selectedLicenceType}
              selectedPackageDays={selectedPackageDays}
              onSelectPackage={onSelectPackage}
            />
            {selectedPackageDates.map((date, index) => {
              const start_date = getPackageStartDate(
                date,
                index,
                selectedPackageDates
              )

              return (
                <FullLicenceDatePicker
                  isWidget={isWidget}
                  schoolId={course.id}
                  licence={selectedLicenceType}
                  bike_hire={bike_hire}
                  type={date.type}
                  key={index}
                  date={date}
                  index={index}
                  showCalendar={
                    selectedPackageDates.findIndex(date => date.date === '') ===
                    index
                  }
                  selectedPackageDates={selectedPackageDates}
                  onSelectPackageDate={onSelectPackageDate}
                  start_date={start_date}
                />
              )
            })}
          </Fragment>
        )}
      </div>
    )
  }
}

export default CourseAvailabilityComponentFullLicence
