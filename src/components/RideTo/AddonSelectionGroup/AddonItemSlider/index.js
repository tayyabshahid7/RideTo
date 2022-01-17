import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { NextArrow, PrevArrow } from './Arrows'

import AddonSizes from './AddonSizes'
import React from 'react'
import RideToButton from 'components/RideTo/Button'
import Slick from 'react-slick'
import kebabCase from 'lodash/kebabCase'
import styles from './AddonItemSlider.scss'

const AddonItemSlider = ({ addons, isAdded, onAdd, onRemove, onDetails }) => {
  const settings = {
    nextArrow: <NextArrow />,
    dots: true,
    prevArrow: <PrevArrow />,
    slidesToShow: 3,
    infinite: true,
    appendDots: dots => (
      <div
        style={{
          backgroundColor: '#ddd',
          borderRadius: '10px',
          padding: '10px'
        }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    )
  }
  console.log(addons)

  function handleSelectSize(selectedSize) {
    const { onSizeUpdate, addon } = this.props
    onSizeUpdate(addon, selectedSize)
  }

  function isDiscount(addon) {
    return (
      addon.full_price &&
      addon.discount_price &&
      parseFloat(addon.full_price) > parseFloat(addon.discount_price)
    )
  }

  const fullPriceStyle = addon => {
    console.log(isDiscount(addon))
    if (!isDiscount(addon)) {
      return styles.price
    } else {
      return styles.priceDiscounted
    }
  }

  const imageClick = () => {
    console.log('Click')
  }

  return (
    <div>
      <Slick {...settings}>
        {addons.map((addon, index) => (
          <div key={index}>
            <p>{addon.name}</p>
          </div>
          // <div key={index} className={styles.slide}>
          //   <div>
          //     <img src={addon.images[0]} alt="" onClick={imageClick} />
          //   </div>

          //   <div className={styles.priceWrap}>
          //     <div className={fullPriceStyle(addon)}>£{addon.full_price}</div>
          //     {isDiscount(addon) && (
          //       <div className={styles.price}> £{addon.discount_price}</div>
          //     )}
          //   </div>
          //   <div className={styles.freeDelivery}>Includes FREE delivery</div>
          //   <h4 className={styles.title}>{addon.name}</h4>

          //   <div>
          //     {addon.sizes.length > 1 && (
          //       <AddonSizes
          //         sizes={addon.sizes}
          //         selected={addon.selectedSize}
          //         onClick={handleSelectSize}
          //         sizeRequired={addon.sizeRequired}
          //       />
          //     )}
          //     <RideToButton
          //       id={`addon-${kebabCase(addon.name)}`}
          //       alt={isAdded}
          //       className={styles.selectButton}
          //       onClick={() => onClick(addon)}>
          //       <span>{!isAdded ? 'Select' : 'Remove'}</span>
          //     </RideToButton>
          //   </div>
          // </div>
        ))}
      </Slick>
    </div>
  )
}

export default AddonItemSlider
