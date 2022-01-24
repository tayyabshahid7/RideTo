import React from 'react'
import styles from './AddonSelectModal.scss'

const AddonSelectModal = props => {
  return (
    <React.Fragment>
      <div className={styles.modal}>
        <div className={styles.overlay} />
        <div className={styles.modalContat}>
          <button className={styles.closeBtn} onClick={props.toggleModal}>
            Exit
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AddonSelectModal
