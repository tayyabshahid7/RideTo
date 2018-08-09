import React from 'react'

import BookingOptions from 'pages/Widget/components/BookingOptions'
import Details from 'pages/Widget/components/Details'
import styles from './WidgetContainer.scss'

const getAddress = loc => {
  return `${loc.address_1}, ${loc.town}, ${loc.postcode}`
}

class WidgetContainer extends React.Component {
  render() {
    const { widget, locations, selectedLocation, onChangeLocation } = this.props
    const address = getAddress(selectedLocation)

    return (
      <div className={styles.widgetContainer}>
        <Details widget={widget} address={address} />
        <BookingOptions
          widget={widget}
          selectedLocation={selectedLocation}
          locations={locations}
          onChangeLocation={onChangeLocation}
        />
      </div>
    )
  }
}

export default WidgetContainer
