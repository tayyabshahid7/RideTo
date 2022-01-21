import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { NextArrow, PrevArrow } from './Arrows'

import AddonSizes from './AddonSizes'
import React from 'react'
import RideToButton from 'components/RideTo/Button'
import Slick from 'react-slick'
import StarsComponent from '../../StarsComponent'
import kebabCase from 'lodash/kebabCase'
import styles from './AddonItemSlider.scss'
import { useMediaQuery } from 'react-responsive'

const AddonItemSlider = ({ addons, isAdded, onAdd, onRemove, onDetails }) => {
  const addonsToShow = () => {
    if (addons.length > 1) {
      if (useMediaQuery({ maxWidth: 768 })) {
        return 2
      } else {
        return 3
      }
    }
    return 1
  }

  const settings = {
    nextArrow: <NextArrow />,
    // dots: true,
    prevArrow: <PrevArrow />,
    slidesToShow: addonsToShow(),
    infinite: true,
    className: styles.slider
    // appendDots: dots => (
    //   <div
    //     style={{
    //       backgroundColor: '#ddd',
    //       borderRadius: '1px',
    //       padding: '1px'
    //     }}>
    //     <ul style={{ margin: '0px' }}> {dots} </ul>
    //   </div>
    // )
  }
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

  const onClick = isAdded ? onRemove : onAdd

  return (
    <div>
      <Slick {...settings}>
        {addons.map((addon, index) => (
          <AddonCard
            key={index}
            addon={addon}
            image={addon.images[0]}
            price={addon.full_price}
            title={addon.name}
            sizes={addon.sizes}
            selectedSize={addon.selectedSize}
            handleSelectSize={handleSelectSize}
            sizeRequired={addon.sizeRequired}
            isAdded={isAdded}
          />
        ))}
      </Slick>
    </div>
  )
}

export default AddonItemSlider

function AddonCard(props) {
  return (
    <div className={styles.card}>
      <div className={styles.card__body}>
        <img src={props.image} className={styles.card__image}></img>
        <p className={styles.card__price}>£{props.price}</p>
        <p className={styles.card__freeDelivery}>Includes FREE Delivery</p>
        <h2 className={styles.card__title}>{props.title}</h2>
        <StarsComponent
          className={styles.card__rating}
          starClassName={styles.card__star}
          rating={4}
        />
      </div>
      <div className={styles.card__buttonWrapper}>
        <div className={styles.card__selectSizeButton}>
          {props.sizes.length > 1 && (
            <AddonSizes
              sizes={props.sizes}
              selected={props.selectedSize}
              onClick={props.handleSelectSize}
              sizeRequired={props.sizeRequired}
            />
          )}
        </div>
        <div className={styles.addToBacketButton}>
          <RideToButton
            id={`addon-${kebabCase(props.name)}`}
            alt={props.isAdded}
            className={styles.selectButton}
            onClick={() => onClick(props.addon)}>
            <span>{!props.isAdded ? 'Add to Basket' : 'Remove'}</span>
          </RideToButton>
        </div>
      </div>
    </div>
  )
}