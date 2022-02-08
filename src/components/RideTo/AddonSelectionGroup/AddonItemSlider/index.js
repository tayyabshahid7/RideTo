import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { NextArrow, PrevArrow } from './Arrows'
import React, { Fragment, useState } from 'react'

import AddonSelectModal from './AddonSelectModal'
import AddonSizes from './AddonSizes'
import RideToButton from 'components/RideTo/Button'
import Slick from 'react-slick'
import StarsComponent from '../../StarsComponent'
import kebabCase from 'lodash/kebabCase'
import styles from './AddonItemSlider.scss'

// import { useMediaQuery } from 'react-responsive'

const AddonItemSlider = props => {
  const { addons, isAdded, onAdd, onRemove, onSizeUpdate, onDetails } = props

  const settings = {
    nextArrow: <NextArrow />,
    // dots: true,
    prevArrow: <PrevArrow />,
    slidesToShow: 4.2,
    infinite: addons.length > 3,
    className: styles.slider,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
          infinite: addons.length > 2,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1
        }
      }
    ]
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
            onSizeUpdate={onSizeUpdate}
            sizeRequired={addon.sizeRequired}
            isAdded={isAdded(addon)}
            onRemove={onRemove}
            onAdd={onAdd}
          />
        ))}
      </Slick>
    </div>
  )
}

export default AddonItemSlider

function AddonCard(props) {
  const [modal, setModal] = useState(false)
  const onClick = props.isAdded ? props.onRemove : props.onAdd

  const handleSelectSize = selectedSize => {
    const { onSizeUpdate, addon } = props
    console.log(selectedSize)
    onSizeUpdate(addon, selectedSize)
  }

  const toggleModal = () => {
    setModal(!modal)
  }

  return (
    <Fragment>
      {modal && (
        <AddonSelectModal
          showModal={modal}
          onClose={toggleModal}
          title={props.title}
          images={props.addon.images}
        />
      )}
      <div className={styles.card}>
        <div className={styles.card__body}>
          <img
            src={props.image}
            className={styles.card__image}
            onClick={toggleModal}
          />
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
                onClick={handleSelectSize}
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
    </Fragment>
  )
}