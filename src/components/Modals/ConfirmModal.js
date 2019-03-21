import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Button } from 'components/ConnectForm'

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
        <Button color="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button color="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirmModal
