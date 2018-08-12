import React from 'react'

import BookingOptions from 'pages/Widget/components/BookingOptions'
import Details from 'pages/Widget/components/Details'
import styles from './WidgetContainer.scss'

const getAddress = loc => {
  return `${loc.address_1}, ${loc.town}, ${loc.postcode}`
}

class WidgetContainer extends React.Component {
  render() {
    const {
      widget,
      slug,
      suppliers,
      selectedSupplier,
      onChangeSupplier
    } = this.props
    const address = getAddress(selectedSupplier)

    return (
      <div className={styles.widgetContainer}>
        <Details widget={widget} address={address} />
        <BookingOptions
          widget={widget}
          slug={slug}
          selectedSupplier={selectedSupplier}
          suppliers={suppliers}
          onChangeSupplier={onChangeSupplier}
        />
      </div>
    )
  }
}

export default WidgetContainer
