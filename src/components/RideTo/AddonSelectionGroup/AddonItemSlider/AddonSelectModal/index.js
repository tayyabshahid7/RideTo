import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import AddonSizes from '../AddonSizes'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import React from 'react'
import RideToButton from 'components/RideTo/Button'
import Slick from 'react-slick'
import StarsComponent from '../../../StarsComponent'
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
  sizeRequired
}) => {
  const settings = {
    slidesToShow: 3.2,
    infinite: true,
    dots: true,
    className: styles.slick,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
          infinite: images.length > 2,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: images.length > 2,
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
            <Slick {...settings}>
              {images.map((image, index) => (
                <div key={index} className={styles.modal__addonImageContainer}>
                  <img
                    src={image}
                    alt={image.name}
                    className={styles.modal__addonImage}
                  />
                </div>
              ))}
            </Slick>
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
            <div className={styles.addToBacketButton}>
              {/* <RideToButton
                id={`addon-${kebabCase(props.name)}`}
                alt={props.isAdded}
                className={styles.selectButton}
                onClick={() => onClick(props.addon)}>
                <span>{!props.isAdded ? 'Add to Basket' : 'Remove'}</span>
              </RideToButton> */}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {/* <Button color="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button color="link" onClick={onClose}>
          Cancel
        </Button> */}
      </ModalFooter>
    </Modal>
  )
}

export default AddonSelectModal
