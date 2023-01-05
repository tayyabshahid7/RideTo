import React from 'react'
import { Modal, ModalBody } from 'reactstrap'
import styles from './styles.scss'

function CalendarModal(props) {
  return (
    <Modal modalClassName={styles.modal}>
      <ModalBody></ModalBody>
    </Modal>
  )
}

export default CalendarModal
