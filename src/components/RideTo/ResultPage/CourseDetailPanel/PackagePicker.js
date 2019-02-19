import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import Select from 'components/RideTo/Select'
// import { getPricingForCourse } from 'services/course'
// import { getPackageDays } from 'common/info'

class PackagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prices: [
        { days: 4, price: null },
        { days: 5, price: null },
        { days: 6, price: null }
      ]
    }
    this.handleChange = this.handleChange.bind(this)
  }

  loadPrices() {
    // const { prices } = this.state;
  }

  componentDidMount() {}

  handleChange(event) {
    const { onSelectPackage } = this.props

    onSelectPackage(event.target.value)
  }

  render() {
    const {
      bike_hire,
      selectedLicenceType,
      selectedPackageDays,
      isWidget
    } = this.props

    return (
      <div className={styles.packageWrapper}>
        <label id="choose-licence" className={styles.subtitle1}>
          Training Package
        </label>
        <div>
          <Select
            value={selectedPackageDays}
            name="rider_type"
            className={classnames(
              styles.packageSelect,
              isWidget && styles.widgetSelect
            )}
            onChange={this.handleChange}
            required
            disabled={!(bike_hire && selectedLicenceType)}>
            <option value="" hidden disabled>
              Select Package
            </option>
            <option value="4">4 Days - £870.50</option>
            <option value="5">5 Days - £1065.50</option>
            <option value="6">6 Days - £1260.50</option>
          </Select>
        </div>
      </div>
    )
  }
}

export default PackagePicker
