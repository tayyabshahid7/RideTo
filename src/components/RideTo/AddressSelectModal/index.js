import React from 'react'
import classnames from 'classnames'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import styles from './styles.scss'

class AddressSelectModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }

  getAddressString(address) {
    let addressString = address
      .split(',')
      .filter(part => part.trim() !== '')
      .join(', ')
    return addressString
  }

  render() {
    const { isOpen, onClose, onSelect, addresses } = this.props
    const { selectedIndex } = this.state
    return (
      <Modal isOpen={isOpen} toggle={onClose} size={'md'}>
        <ModalHeader toggle={onClose}>Select Address</ModalHeader>
        <ModalBody>
          <div className={styles.addressContainer}>
            {addresses.map((address, index) => (
              <div
                key={index}
                className={classnames(
                  styles.addressItem,
                  selectedIndex === index && styles.active
                )}
                onClick={() => this.setState({ selectedIndex: index })}>
                {this.getAddressString(address)}
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={() => onSelect(addresses[selectedIndex])}>
            Select
          </button>
          <button className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default AddressSelectModal
