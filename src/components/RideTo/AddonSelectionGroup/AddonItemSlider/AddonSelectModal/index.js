import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import React, { useState } from 'react'

import AddonImageSliderModal from '../../AddonImageSliderModal'
import AddonReviewModal from './AddonReviewModal'
import AddonSizes from '../AddonSizes'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import RideToButton from 'components/RideTo/Button'
import StarsComponent from '../../../StarsComponent'
import classnames from 'classnames'
import kebabCase from 'lodash/kebabCase'
import styles from './AddonSelectModal.scss'
import { useMediaQuery } from 'react-responsive'

const CloseButtonIcon = ({ icon, onClick }) => {
  return (
    <button onClick={onClick} className={styles.buttonClose}>
      <div className={styles.imgButtonCloseContainer}>
        <img src={icon} alt="close-modal" />
      </div>
    </button>
  )
}

const AddonSelectModal = ({
  showModal,
  onClose,
  title,
  images,
  sizes,
  selected,
  handleSelectSize,
  sizeRequired,
  isAdded,
  name,
  addon,
  onClickAddAddon,
  rating,
  price,
  priceDiscounted,
  isDiscount
}) => {
  const [detailReviewButton, setDetailReviewButton] = useState(true)
  const isMobile = useMediaQuery({ maxWidth: 1024 })

  const modalSize = isMobile ? '' : 'xl'

  return (
    <Modal
      isOpen={showModal}
      size={modalSize}
      toggle={onClose}
      fullscreen="true"
      scrollable
      backdrop="static"
      modalClassName={styles.modal}>
      <ModalHeader
        close={<CloseButtonIcon icon={CloseDark} onClick={onClose} />}
        toggle={onClose}
        className={styles.header}
      />
      <ModalBody className={styles.modal__body}>
        <div className={styles.modal__bodyContainer}>
          <div className={styles.modal__title}>{title}</div>
          {isDiscount && (
            <div className={styles.card__priceWrapper}>
              <span className={styles.modal__discountedPrice}>£{price}</span>
              <span className={styles.modal__price}> £{priceDiscounted}</span>
            </div>
          )}
          {!isDiscount && <div className={styles.modal__price}>£{price}</div>}
          <div>
            <p className={styles.modal__freeDelivery}>Includes FREE delivery</p>
          </div>
          <div className={styles.modal__starContainer}>
            <StarsComponent
              className={styles.modal__rating}
              starClassName={styles.modal__star}
              rating={rating}
            />
          </div>
          <AddonImageSliderModal images={images} />
          <div className={styles.card__buttonWrapper}>
            <div className={styles.card__selectSizeButton}>
              {sizes.length > 1 && (
                <AddonSizes
                  sizes={sizes}
                  selected={selected}
                  onClick={handleSelectSize}
                  sizeRequired={sizeRequired}
                />
              )}
            </div>
            <div className={styles.card__addToBucketButton}>
              <RideToButton
                id={`addon-${kebabCase(name)}`}
                alt={isAdded}
                className={styles.card__selectButton}
                onClick={() => onClickAddAddon(addon)}>
                <span>{!isAdded ? 'Add to Basket' : 'Remove'}</span>
              </RideToButton>
            </div>
          </div>
          <div className={styles.card__detailReviewWrapper}>
            <div className={styles.card__detailReviewButtonWrapper}>
              <button
                className={classnames(
                  styles.card__detailReviewButton,
                  detailReviewButton && styles.card__active
                )}
                onClick={() => {
                  setDetailReviewButton(true)
                }}>
                Details
              </button>
              <button
                className={styles.card__detailReviewButton}
                onClick={() => {
                  setDetailReviewButton(false)
                }}>
                Reviews
              </button>
            </div>
            <div className={styles.card__detailReviewText}>
              {detailReviewButton && (
                <div className={styles.card__description}>
                  {addon.description}
                </div>
              )}
              {!detailReviewButton &&
                addon.ratings.map((rating, index) => {
                  return (
                    <AddonReviewModal
                      key={index}
                      name={rating.author}
                      rating={rating.rating}
                      description={rating.review}
                      date={rating.time}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default AddonSelectModal
