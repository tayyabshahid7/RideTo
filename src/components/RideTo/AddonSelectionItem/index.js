import React from 'react'
import classnames from 'classnames'

import Info from 'assets/images/rideto/Info.svg'
import Add from 'assets/images/rideto/Add.svg'
import AddWhite from 'assets/images/rideto/AddWhite.svg'
import Added from 'assets/images/rideto/Added.svg'
import Remove from 'assets/images/rideto/Remove.svg'
import AddonSizes from './AddonSizes'
import AddonImageSlider from './AddonImageSlider'
import styles from './AddonSelectionItem.scss'

class AddonSelectionItem extends React.Component {
  constructor(props) {
    super(props)
    const { addon } = props

    this.state = {
      selectedSize: addon.sizes.filter(({ quantity }) => quantity > 0)[0]
    }

    this.handleSelectSize = this.handleSelectSize.bind(this)
  }

  handleSelectSize(selectedSize) {
    this.setState({ selectedSize })
  }

  render() {
    const { addon, isAdded, onAdd, onRemove, onDetails } = this.props
    const { selectedSize } = this.state
    const { images, sizes } = addon
    const isDiscount =
      addon.full_price &&
      addon.discount_price &&
      addon.full_price > addon.discount_price
    const price = addon.discount_price || addon.full_price
    const ctaClassName = classnames(styles.cta, isAdded && styles.added)
    const icon = isAdded ? Added : Add
    const onClick = isAdded ? onRemove : onAdd

    return (
      <div className={styles.addonSelectionItem}>
        <div className={styles.image}>
          <AddonImageSlider images={images} />
        </div>

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
                <div
                  className={styles.details}
                  onClick={() => onDetails(addon)}>
                  <img src={Info} alt="Info" />Details
                </div>
              </div>
            ) : (
              <div className={styles.description}>{addon.description}</div>
            )}
          </div>
          <div
            className={ctaClassName}
            onClick={() => onClick(addon, selectedSize)}>
            <div className={styles.prices}>
              {isDiscount && (
                <div className={styles.fullPrice}>£{addon.full_price}</div>
              )}
              <div className={styles.price}>£{price}</div>
            </div>
            <div className={styles.action}>
              <img className={styles.remove} src={Remove} alt="" />
              <img
                className={classnames(styles.icon, styles.desktopIcon)}
                src={icon}
                alt=""
              />
              <img
                className={classnames(styles.icon, styles.mobileIcon)}
                src={AddWhite}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddonSelectionItem
