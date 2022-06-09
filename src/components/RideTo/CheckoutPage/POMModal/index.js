import RideToButton from 'components/RideTo/Button'
import React from 'react'
import POMSelector from '../POMSelector'
import styles from './styles.scss'

function POMModal({ closeModal, handleAddPOM }) {
  const handleNoClick = () => {
    closeModal()
  }

  const handleYesClick = () => {
    handleAddPOM()
    closeModal()
  }

  return (
    <div className={styles.container}>
      <POMSelector popup />
      <div className={styles.buttons}>
        <RideToButton onClick={handleYesClick} id="pom-popup-yes">
          Yes please
        </RideToButton>
        <button
          className={styles.NoThanksButton}
          onClick={handleNoClick}
          id="pom-popup-no">
          No thanks, I'll risk it
        </button>
      </div>
    </div>
  )
}

export default POMModal
