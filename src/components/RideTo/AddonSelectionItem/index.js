import AddonImageSlider from './AddonImageSlider'
import AddonSizes from './AddonSizes'
import React from 'react'
import RideToButton from 'components/RideTo/Button'
import kebabCase from 'lodash/kebabCase'
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
      parseFloat(addon.full_price) > parseFloat(addon.discount_price)
    const price = addon.discount_price || addon.full_price
    const onClick = isAdded ? onRemove : onAdd

    return (
      <div className={styles.addonSelectionItem} id={'addon-' + addon.id}>
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
                id={`addon-${kebabCase(addon.name)}`}
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
