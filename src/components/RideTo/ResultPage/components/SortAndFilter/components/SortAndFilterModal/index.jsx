import { dropdownLine } from 'assets/icons'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import React from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import styles from './styles.scss'

const options = [
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Price' },
  { value: 'price', label: 'Price' },
  { value: 'price', label: 'Price' }
]

export function SortAndFilterModal({ isOpen, onClose }) {
  const CloseButtonIcon = (
    <button onClick={onClose} className={styles.buttonClose}>
      <img src={CloseDark} alt="close-modal" />
    </button>
  )

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props} className={styles.boxSelectRadius}>
        {children}
      </components.Control>
    )
  }

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator
        {...props}
        className={styles.boxSelectRadiusIndicator}>
        <img src={dropdownLine} alt="" />
      </components.DropdownIndicator>
    )
  }

  const SingleValue = props => {
    return (
      <components.SingleValue {...props} className={styles.boxSelectRadiusText}>
        {props.children}
      </components.SingleValue>
    )
  }

  const Option = props => {
    return (
      <components.Option {...props} className={styles.boxSelectRadiusOption}>
        {props.children}
      </components.Option>
    )
  }

  const indicatorSeparatorStyle = {
    display: 'none'
  }

  const IndicatorSeparator = ({ innerProps }) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />
  }
  return (
    <Modal
      isOpen={isOpen}
      backdrop="static"
      className={styles.modal}
      contentClassName={styles.modalContent}>
      <ModalHeader
        className={styles.modalHeader}
        toggle={onClose}
        close={CloseButtonIcon}>
        Sort & Filter
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div>
          <span className={styles.title}>Sort By</span>
          <Select
            defaultValue={options[0]}
            options={options}
            menuPlacement="auto"
            components={{
              Control,
              DropdownIndicator,
              IndicatorSeparator,
              SingleValue,
              Option
            }}
            onChange={e => console.log(e.value)}
          />

          <span className={styles.title}>Filter By</span>
          <div className={styles.filterWrapper}>
            <span className={styles.subtitle}>Equipment Provided</span>
            <span className={styles.subtitle}>Site Facilities</span>
            <span className={styles.subtitle}>Booking options</span>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
