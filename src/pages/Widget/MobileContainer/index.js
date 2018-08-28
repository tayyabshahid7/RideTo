import React from 'react'

import styles from './MobileContainer.scss'
import BookingOption from 'pages/Widget/components/BookingOption'
import { parseQueryString } from 'services/api'
import { getInitialSuppliers, getAddress } from 'services/widget'

class MobileContainer extends React.Component {
  constructor(props) {
    super(props)

    this.widget = window.RIDE_TO_DATA.widget_initial
    this.suppliers = getInitialSuppliers()

    this.handleNav = this.handleNav.bind(this)
    this.handleChangeSupplier = this.handleChangeSupplier.bind(this)
  }

  handleNav(supplierId) {
    const { match, history } = this.props
    const { slug } = match.params
    history.push(`/widget/${slug}/details?supplier=${supplierId}`)
  }

  handleChangeSupplier(id) {
    const { match, history } = this.props
    const { slug } = match.params
    history.push(`/widget/${slug}?supplier=${id}`)
  }

  render() {
    const query = parseQueryString(window.location.search.slice(1))
    const selectedSupplier = query.supplier
      ? this.suppliers.filter(
          ({ id }) => id === parseInt(query.supplier, 10)
        )[0]
      : this.suppliers[0]
    const address = getAddress(selectedSupplier)
    const style = {
      color: this.widget.button_color
    }

    return (
      <div className={styles.mobileContainer}>
        <div className={styles.intro}>{this.widget.intro}</div>

        <div className={styles.mobileDetails}>
          <div className={styles.location}>
            <label>Choose Location</label>
            <BookingOption
              options={this.suppliers}
              labelField="address_1"
              selected={selectedSupplier.id}
              onChange={this.handleChangeSupplier}
            />
          </div>

          <div className={styles.block}>
            <h3 className={styles.subHeading}>Address</h3>
            {address}
          </div>

          <div className={styles.block}>
            <h3 className={styles.subHeading}>Requirements</h3>
            <div
              dangerouslySetInnerHTML={{ __html: this.widget.requirements }}
            />
          </div>

          <div className={styles.block}>
            <h3 className={styles.subHeading}>Cancellations</h3>
            {this.widget.cancellation}
          </div>

          <div className={styles.block}>
            You can also view the terms{' '}
            <strong>
              <a style={style} href={this.widget.terms} target="_blank">
                here.
              </a>
            </strong>
          </div>
        </div>

        <div className={styles.actions}>
          <a
            className="WidgetBtn"
            onClick={() => this.handleNav(selectedSupplier.id)}>
            Continue
          </a>
        </div>
      </div>
    )
  }
}

export default MobileContainer
