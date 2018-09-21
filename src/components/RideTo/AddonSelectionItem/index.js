import React from 'react'

import Info from 'assets/images/rideto/Info.svg'
import AddonSizes from './AddonSizes'
import styles from './AddonSelectionItem.scss'

class AddonSelectionItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSize: null
    }

    this.handleSelectSize = this.handleSelectSize.bind(this)
  }

  handleSelectSize(selectedSize) {
    this.setState({ selectedSize })
  }

  render() {
    const { addon } = this.props
    const { selectedSize } = this.state
    const { images, sizes } = addon
    const bgImg = { backgroundImage: `url(${images[0]})` }

    return (
      <div className={styles.addonSelectionItem}>
        <div className={styles.backgroundImg} style={bgImg} />

        <div className={styles.content}>
          <div className={styles.info}>
            <h5>{addon.name}</h5>
            {sizes.length ? (
              <div className={styles.sizes}>
                <AddonSizes
                  sizes={sizes}
                  selected={selectedSize}
                  onClick={this.handleSelectSize}
                />
                <div className={styles.details}>
                  <img src={Info} alt="Info" />Details
                </div>
              </div>
            ) : (
              <div className={styles.description}>{addon.description}</div>
            )}
          </div>
          <a className={styles.cta} />
        </div>
      </div>
    )
  }
}

export default AddonSelectionItem
