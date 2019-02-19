import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import Select from 'components/RideTo/Select'
import { fetchDasPackagePrice } from 'services/course'

class PackagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prices: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  async loadPrices() {
    const { schoolId } = this.props

    const prices = await fetchDasPackagePrice(schoolId)

    this.setState({
      prices
    })
  }

  componentDidMount() {
    this.loadPrices()
  }

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
    const { prices } = this.state

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
            {prices && (
              <Fragment>
                <option value="4">
                  4 Days - £{(prices.package_4 / 100.0).toFixed(2)}
                </option>
                <option value="5">
                  5 Days - £{(prices.package_5 / 100.0).toFixed(2)}
                </option>
                <option value="6">
                  6 Days - £{(prices.package_6 / 100.0).toFixed(2)}
                </option>
              </Fragment>
            )}
          </Select>
        </div>
      </div>
    )
  }
}

export default PackagePicker
