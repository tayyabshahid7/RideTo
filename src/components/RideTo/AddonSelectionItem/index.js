import React from 'react'
import AddonSizes from './AddonSizes'
import AddonImageSlider from './AddonImageSlider'
import styles from './AddonSelectionItem.scss'
import RideToButton from 'components/RideTo/Button'

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
    const onClick = isAdded ? onRemove : onAdd

    return (
      <div className={styles.addonSelectionItem}>
        <h2 className={styles.title}>{addon.name}</h2>

        <div className={styles.row}>
          <div className={styles.headerWrap}>
            <AddonImageSlider
              addon={addon}
              onDetails={onDetails}
              images={images}
            />
          </div>

          <div className={styles.descriptionWrap}>
            <h3 className={styles.smallTitle}>Description</h3>
            <div className={styles.description}>{addon.description}</div>
          </div>

          <div className={styles.priceWrap}>
            <h3 className={styles.smallTitle}>Our Price</h3>

            <div>
              <div className={styles.price}>£{price}</div>
              {isDiscount && (
                <div className={styles.fullPrice}>Was £{addon.full_price}</div>
              )}
              <div className={styles.freeDelivery}>Includes FREE delivery</div>
            </div>

            <div>
              {sizes.length > 1 && (
                <AddonSizes
                  sizes={sizes}
                  selected={selectedSize}
                  onClick={this.handleSelectSize}
                  sizeRequired={sizeRequired}
                />
              )}
              <RideToButton
                alt={isAdded}
                className={styles.selectButton}
                onClick={() => onClick(addon)}>
                <span>{!isAdded ? 'Select' : 'Remove'}</span>
              </RideToButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddonSelectionItem
