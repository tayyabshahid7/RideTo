import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const DeleteConfirmModal = ({
  showModal,
  onClose,
  onDelete,
  message,
  title = 'Delete?'
}) => {
  return (
    <Modal isOpen={showModal} toggle={onClose} size={'md'}>
      <ModalHeader toggle={onClose}>{title}</ModalHeader>
      <ModalBody>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
        <button className="btn btn-default" onClick={onClose}>
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirmModal
