import React, { Component, Fragment } from 'react'
import { getDasBikeTypes } from 'services/course'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import LicencePicker from 'components/RideTo/ResultPage/CourseDetailPanel/LicencePicker'
import PackagePicker from 'components/RideTo/ResultPage/CourseDetailPanel/PackagePicker'

class CalendarFullLicence extends Component {
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
    const { id } = this.props.selectedSupplier
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
      selectedBikeHire,
      selectedLicenceType,
      selectedPackageDays,
      onUpdate,
      onSelectPackage
    } = this.props
    const {
      hasAutoBikes,
      hasManualBikes,
      loading,
      autoLicences,
      manualLicences
    } = this.state

    return (
      <div>
        <p>DAS courses take place over multiple days.</p>
        <BikePicker
          isWidget
          isFullLicence
          has_auto_bikes={hasAutoBikes}
          has_manual_bikes={hasManualBikes}
          bike_hire={selectedBikeHire}
          onUpdate={onUpdate}
          loading={loading}
        />

        {['auto', 'manual'].includes(selectedBikeHire) && (
          <Fragment>
            <LicencePicker
              isWidget
              selectedLicenceType={selectedLicenceType}
              onUpdate={onUpdate}
              licences={
                selectedBikeHire === 'auto' ? autoLicences : manualLicences
              }
            />
            <PackagePicker
              isWidget
              bike_hire={selectedBikeHire}
              selectedLicenceType={selectedLicenceType}
              selectedPackageDays={selectedPackageDays}
              onSelectPackage={onSelectPackage}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

export default CalendarFullLicence
