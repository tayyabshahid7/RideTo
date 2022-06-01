import classnames from 'classnames'
import RideToButton from 'components/RideTo/Button'
import kebabCase from 'lodash/kebabCase'
import React, { Fragment, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import RideToSlider from '../../../RideToSlider'
import StarsComponent from '../../StarsComponent'
import styles from './AddonItemSlider.scss'
import AddonSelectModal from './AddonSelectModal'
import AddonSizes from './AddonSizes'
import { NextArrow, PrevArrow } from './SliderArrows'

const AddonItemSlider = props => {
  const {
    addons,
    allAddons,
    isAdded,
    onAdd,
    onRemove,
    onSizeUpdate,
    groupName
  } = props
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const settings = {
    dots: true,
    className: styles.slider,
    speed: 500,
    arrows: isMobile ? false : true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    infinite: false,
    variableWidth: true,
    customPaging: i => {
      return (
        <button>
          <div className={styles.dot} />
        </button>
      )
    },
    dotsClass: styles.dots,
    responsive: [
      {
        breakpoint: 574,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1,
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
    if (!isDiscount(addon)) {
      return styles.card__price
    } else {
      return styles.priceDiscounted
    }
  }

  return (
    <div className={styles.sliderWrapper}>
      <RideToSlider settings={settings}>
        {addons.map((a, index) => {
          const addon = allAddons.find(x => x.id === a.id)
          return (
            <AddonCard
              key={index}
              addon={addon}
              groupName={groupName}
              image={addon.images[0]}
              price={addon.full_price}
              fullPriceStyle={fullPriceStyle(addon)}
              isDiscount={isDiscount(addon)}
              title={addon.name}
              sizes={addon.sizes}
              selectedSize={addon.selectedSize}
              onSizeUpdate={onSizeUpdate}
              sizeRequired={addon.sizeRequired}
              isAdded={isAdded(addon)}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          )
        })}
      </RideToSlider>
    </div>
  )
}

export default AddonItemSlider

function AddonCard(props) {
  const { groupName } = props
  const [modal, setModal] = useState(false)
  const onClick = props.isAdded ? props.onRemove : props.onAdd

  const getRating = () => {
    const { addon } = props
    const { ratings } = addon

    if (!ratings) {
      return null
    }

    if (ratings.length === 0) {
      return null
    }

    let avgRating = 0
    for (let i = 0; i < ratings.length; i++) {
      avgRating += ratings[i].rating
    }
    return avgRating / ratings.length
  }

  const handleSelectSize = selectedSize => {
    const { onSizeUpdate, addon } = props
    onSizeUpdate(addon, selectedSize)
  }

  const toggleModal = event => {
    event.preventDefault()
    setModal(!modal)
  }
  const buttonStyle = !props.isAdded ? styles.selectButton : styles.removeButton

  return (
    <Fragment>
      {modal && (
        <AddonSelectModal
          showModal={modal}
          onClose={toggleModal}
          title={props.title}
          images={props.addon.images}
          sizes={props.sizes}
          selected={props.selectedSize}
          handleSelectSize={handleSelectSize}
          sizeRequired={props.sizeRequired}
          isAdded={props.isAdded}
          name={props.name}
          addon={props.addon}
          onClickAddAddon={onClick}
          rating={getRating()}
          price={props.price}
          priceDiscounted={props.addon.discount_price}
          isDiscount={props.isDiscount}
        />
      )}
      <div
        className={classnames(
          styles.card,
          groupName === 'OTHER' && styles.cardOther
        )}>
        <div className={styles.card__body}>
          <img
            src={props.image}
            alt={props.addon.name}
            className={styles.card__image}
            onClick={toggleModal}
          />
          {props.isDiscount && (
            <div className={styles.card__priceWrapper}>
              <span className={styles.card__discountedPrice}>
                £{props.price}
              </span>
              <span className={styles.card__price}>
                {' '}
                £{props.addon.discount_price}
              </span>
            </div>
          )}
          {!props.isDiscount && (
            <div className={styles.card__price}>£{props.price}</div>
          )}

          <p className={styles.card__freeDelivery}>Includes FREE Delivery</p>
          <h2 className={styles.card__title}>{props.title}</h2>
          {getRating() && (
            <StarsComponent
              className={styles.card__rating}
              starClassName={styles.card__star}
              rating={getRating()}
            />
          )}
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
          <div className={styles.addToBucketButton}>
            <RideToButton
              id={`addon-${kebabCase(props.name)}`}
              alt={props.isAdded}
              className={buttonStyle}
              onClick={() => onClick(props.addon)}>
              <span>
                {!props.isAdded ? 'Add to Basket' : 'Remove From Basket'}
              </span>
            </RideToButton>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
