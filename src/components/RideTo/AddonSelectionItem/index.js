import React from 'react'
import classnames from 'classnames'

import Info from 'assets/images/rideto/Info.svg'
import AddonSizes from './AddonSizes'
import AddonImageSlider from './AddonImageSlider'
import styles from './AddonSelectionItem.scss'

class AddonSelectionItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelectSize = this.handleSelectSize.bind(this)
  }

  handleSelectSize(selectedSize) {
    const { onSizeUpdate, addon } = this.props
    onSizeUpdate(addon, selectedSize)
  }

  render() {
    const { addon, isAdded, onAdd, onRemove, onDetails } = this.props
    const { images, sizes, selectedSize, sizeRequired } = addon
    const isDiscount =
      addon.full_price &&
      addon.discount_price &&
      addon.full_price > addon.discount_price
    const price = addon.discount_price || addon.full_price
    const ctaClassName = classnames(styles.cta, isAdded && styles.added)
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
                {sizes.length > 1 && (
                  <AddonSizes
                    sizes={sizes}
                    selected={selectedSize}
                    onClick={this.handleSelectSize}
                    sizeRequired={sizeRequired}
                  />
                )}
                <div
                  className={classnames(
                    styles.details,
                    sizes.length === 1 && styles.singleSizeDetails
                  )}
                  onClick={() => onDetails(addon)}>
                  <img src={Info} alt="Info" />
                  Details
                </div>
              </div>
            ) : (
              <div className={styles.description}>{addon.description}</div>
            )}
          </div>
          <div className={ctaClassName} onClick={() => onClick(addon)}>
            <div className={styles.prices}>
              {isDiscount && (
                <div className={styles.fullPrice}>£{addon.full_price}</div>
              )}
              <div className={styles.price}>£{price}</div>
            </div>
            <div className={styles.action}>
              {!isAdded ? 'Select' : 'Remove'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddonSelectionItem
