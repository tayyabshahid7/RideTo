import React from 'react'

import styles from './MobileContainer.scss'
import MobileDetails from 'pages/Widget/components/MobileDetails'
import BookingOptions from 'pages/Widget/components/BookingOptions'

class MobileContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'details'
    }
  }

  handleNav(page) {
    this.setState({ page })
  }

  render() {
    const {
      widget,
      slug,
      suppliers,
      selectedSupplier,
      onChangeSupplier
    } = this.props
    const { page } = this.state

    return (
      <div className={styles.mobileContainer}>
        <h1 className={styles.heading}>
          <img className={styles.logo} src={widget.logo} />
        </h1>

        {page === 'details' ? (
          <MobileDetails
            widget={widget}
            onContinue={() => this.handleNav('options')}
          />
        ) : null}

        {page === 'options' ? (
          <BookingOptions
            widget={widget}
            slug={slug}
            selectedSupplier={selectedSupplier}
            suppliers={suppliers}
            onChangeSupplier={onChangeSupplier}
          />
        ) : null}
      </div>
    )
  }
}

export default MobileContainer
