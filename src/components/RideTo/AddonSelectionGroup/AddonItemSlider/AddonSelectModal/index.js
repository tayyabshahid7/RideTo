import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import React, { useState } from 'react'

import AddonReviewModal from './AddonReviewModal'
import AddonSizes from '../AddonSizes'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import RideToButton from 'components/RideTo/Button'
import RideToSlider from '../../../../RideToSlider'
import StarsComponent from '../../../StarsComponent'
import kebabCase from 'lodash/kebabCase'
import styles from './AddonSelectModal.scss'

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
  selectedSize,
  handleSelectSize,
  sizeRequired,
  isAdded,
  name,
  addon,
  onClickAddAddon
}) => {
  const [detailReviewButton, setDetailReviewButton] = useState(true)

  const settings = {
    slidesToShow: 4,
    infinite: false,
    dots: true,
    className: styles.slick,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      }
    ]
  }
  return (
    <Modal
      isOpen={showModal}
      toggle={onClose}
      fullscreen
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
          <div className={styles.modal__price}>£19.99</div>
          <div>
            <p className={styles.modal__freeDelivery}>Includes FREE delivery</p>
          </div>
          <div className={styles.modal__starContainer}>
            <StarsComponent
              className={styles.modal__rating}
              starClassName={styles.modal__star}
              rating={4}
            />
          </div>
          <div className={styles.modal__addonSlickImage_container}>
            <RideToSlider settings={settings}>
              {images.map((image, index) => (
                <div key={index} className={styles.modal__addonImageContainer}>
                  <img
                    src={image}
                    alt={image.name}
                    className={styles.modal__addonImage}
                  />
                </div>
              ))}
            </RideToSlider>
          </div>
          <div className={styles.card__buttonWrapper}>
            <div className={styles.card__selectSizeButton}>
              {sizes.length > 1 && (
                <AddonSizes
                  sizes={sizes}
                  selected={selectedSize}
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
                className={styles.card__detailReviewButton}
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
      {/* <ModalFooter> */}
      {/* <Button color="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button color="link" onClick={onClose}>
          Cancel
        </Button> */}
      {/* </ModalFooter> */}
    </Modal>
  )
}

export default AddonSelectModal
