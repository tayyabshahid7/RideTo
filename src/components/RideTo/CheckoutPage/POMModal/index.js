import React from 'react'
import POMSelector from '../POMSelector'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'

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
      <div className={styles.title}>Recommended for new riders</div>
      <POMSelector popup />
      <div className={styles.buttons}>
        <RideToButton alt onClick={handleNoClick} id="pom-popup-no">
          No thanks
        </RideToButton>{' '}
        <RideToButton onClick={handleYesClick} id="pom-popup-yes">
          Yes please
        </RideToButton>
      </div>
    </div>
  )
}

export default POMModal
