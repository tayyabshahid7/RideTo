import CloseDark from 'assets/images/rideto/CloseDark.svg'
import RideToButton from 'components/RideTo/Button'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import styles from './styles.scss'

import moment from 'moment'
import { parseQueryString } from 'services/api'

function CalendarModal({ isOpen, onClose }) {
  const [calendarValue, setCalendarValue] = useState(new Date())

  useEffect(() => {
    const dateParam = new URLSearchParams(window.location.search).get('date')

    if (dateParam && moment(dateParam).isValid()) {
      const currentDate = moment(dateParam).toDate()

      setCalendarValue(currentDate)
    }
  }, [])

  function handleCalendarChange(e) {
    setCalendarValue(e)
  }

  function handleSearchClick() {
    const formattedDate = moment(calendarValue).format('YYYY-MM-DD')
    const qs = parseQueryString(window.location.search.slice(1))
    qs['date'] = formattedDate
    const paramString = new URLSearchParams(qs).toString()
    window.location = `/course-location/?${paramString}`
  }

  const CloseButtonIcon = (
    <button onClick={onClose} className={styles.buttonClose}>
      <img src={CloseDark} alt="close-modal" />
    </button>
  )

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      modalClassName={styles.modal}
      className={styles.modalDialog}
      contentClassName={styles.modalContent}
      wrapClassName={styles.modalWrapper}
      backdropClassName={styles.modalBackDrop}>
      <ModalHeader className={styles.modalHeader} close={CloseButtonIcon}>
        Choose a date
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <Calendar
          onChange={handleCalendarChange}
          value={calendarValue}
          locale="en-GB"
          next2Label={null}
          prev2Label={null}
          className={styles.calendar}
          showNeighboringMonth={false}
        />
        <RideToButton
          className={styles.searchButton}
          onClick={handleSearchClick}>
          Search
        </RideToButton>
      </ModalBody>
    </Modal>
  )
}

export default CalendarModal
