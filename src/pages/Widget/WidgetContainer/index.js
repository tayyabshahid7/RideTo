import React from 'react'

import BookingOptionsContainer from 'pages/Widget/BookingOptionsContainer'
import Details from 'pages/Widget/components/Details'
import styles from './WidgetContainer.scss'
import { parseQueryString } from 'services/api'
import { getInitialSuppliers, getAddress } from 'services/widget'

const COURSETYPE_ORDER_WIDGET = [
  'LICENCE_CBT',
  'INTRO_TO_MOTORCYCLING',
  'LICENCE_CBT_RENEWAL',
  'FULL_LICENCE',
  'TFL_ONE_ON_ONE',
  'ENHANCED_RIDER_SCHEME',
  'BIKE_HIRE'
]

class WidgetContainer extends React.Component {
  constructor(props) {
    super(props)

    this.widget = window.RIDE_TO_DATA.widget_initial
    this.suppliers = getInitialSuppliers()

    this.handleChangeSupplier = this.handleChangeSupplier.bind(this)
  }

  handleChangeSupplier(id) {
    const { match, history } = this.props
    const { slug } = match.params
    history.push(`/widget/${slug}/details?supplier=${id}`)
  }

  render() {
    const { match } = this.props
    const { slug } = match.params
    const query = parseQueryString(window.location.search.slice(1))
    const selectedSupplier = query.supplier
      ? this.suppliers.filter(
          ({ id }) => id === parseInt(query.supplier, 10)
        )[0]
      : this.suppliers[0]
    const address = getAddress(selectedSupplier)

    selectedSupplier.courses = COURSETYPE_ORDER_WIDGET.map(constant =>
      selectedSupplier.courses.find(
        courseType => courseType.constant === constant
      )
    ).filter(Boolean)

    return (
      <div className={styles.widgetContainer}>
        <Details widget={this.widget} address={address} />
        <BookingOptionsContainer
          widget={this.widget}
          slug={slug}
          selectedSupplier={selectedSupplier}
          suppliers={this.suppliers}
          onChangeSupplier={this.handleChangeSupplier}
        />
      </div>
    )
  }
}

export default WidgetContainer
