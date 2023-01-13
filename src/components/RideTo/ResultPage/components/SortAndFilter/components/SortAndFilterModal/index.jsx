import { dropdownLine } from 'assets/icons'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'
import Checkbox from 'components/Checkbox'
import RideToButton from 'components/RideTo/Button'
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import styles from './styles.scss'

const options = [
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Price' },
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' }
]

export function SortAndFilterModal({
  isOpen,
  onClose,
  courses,
  handleUpdateOption
}) {
  const [filters, setFilters] = useState([])

  useEffect(() => {
    console.log(courses)

    if (courses) {
      const { available } = courses

      // Equipment Provided
      const helmetHireCount = available.reduce(
        (n, course) => n + (course.helmet_hire === true),
        0
      )

      const jacketGlovesCount = available.reduce(
        (n, course) => n + (course.gloves_jacket_included === true),
        0
      )
      const bikeHireIncludedCount = available.reduce(
        (n, course) => n + (course.bike_hire === true),
        0
      )

      // Site Facilities
      const onSiteCoffeeCount = available.reduce(
        (n, course) => n + (course.on_site_cafe === true),
        0
      )

      const onSiteParkingCount = available.reduce(
        (n, course) => n + (course.on_site_parking === true),
        0
      )

      const indoorClassroomCount = available.reduce(
        (n, course) => n + (course.indoor_classroom === true),
        0
      )

      // Booking options
      const instantBookCount = available.reduce(
        (n, course) => n + (course.instant_book === true),
        0
      )
      const mciacApprovedCount = available.reduce(
        (n, course) => n + (course.mciac_approved === true),
        0
      )

      if (helmetHireCount || jacketGlovesCount || bikeHireIncludedCount) {
        const equipmentProvidedObj = {
          title: 'Equipment Provided',
          items: [
            { name: 'Helmet', count: helmetHireCount },
            { name: 'Jacket & Gloves', count: jacketGlovesCount },
            { name: 'Bike Hire', count: bikeHireIncludedCount }
          ]
        }

        setFilters(previousState => [...previousState, equipmentProvidedObj])
      }

      if (onSiteCoffeeCount || onSiteParkingCount || indoorClassroomCount) {
        const siteFacilitiesObj = {
          title: 'Site Facilities',
          items: [
            { name: 'Cafe', count: onSiteCoffeeCount },
            { name: 'Free Parking', count: onSiteParkingCount },
            { name: 'Indoor Classroom', count: indoorClassroomCount }
          ]
        }

        setFilters(previousState => [...previousState, siteFacilitiesObj])
      }

      if (instantBookCount || mciacApprovedCount) {
        const bookingOptionsObj = {
          title: 'Booking options',
          items: [
            { name: 'Instant book', count: instantBookCount },
            { name: 'MCIAC Approved', count: mciacApprovedCount }
          ]
        }

        setFilters(previousState => [...previousState, bookingOptionsObj])
      }
    }
  }, [courses])

  function handleCheckBoxSelection(e) {
    console.log(e.target)

    // setFilters(prev => prev.filter(item => item !== e.target.name))

    console.log(filters)
  }

  function handleSearchClick(event) {
    console.log(event)
    // handleUpdateOption()
  }

  const CloseButtonIcon = (
    <button onClick={onClose} className={styles.buttonClose}>
      <img src={CloseDark} alt="close-modal" />
    </button>
  )

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props} className={styles.selectControl}>
        {children}
      </components.Control>
    )
  }

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator
        {...props}
        className={styles.selectDropDownIndicator}>
        <img src={dropdownLine} alt="" />
      </components.DropdownIndicator>
    )
  }

  const SingleValue = props => {
    return (
      <components.SingleValue {...props}>
        {props.children}
      </components.SingleValue>
    )
  }

  const Option = props => {
    return <components.Option {...props}>{props.children}</components.Option>
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
      contentClassName={classnames(styles.modalContent, styles.spaceTitle)}>
      <ModalHeader
        className={styles.modalHeader}
        toggle={onClose}
        close={CloseButtonIcon}>
        Sort & Filter
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <div className={styles.space}>
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
            className={styles.select}
          />
        </div>
        <div className={styles.space}>
          <span className={styles.title}>Filter By</span>
          <div className={styles.filterWrapper}>
            {filters.map(filters => (
              <div key={filters.title} className={styles.checkboxWrapper}>
                <span className={styles.subtitle}>{filters.title}</span>
                {filters.items &&
                  filters.items.map(item => (
                    <div key={item.name} className={styles.itemWrapper}>
                      <Checkbox
                        id={item.name}
                        name={item.name}
                        extraClass={styles.checkbox}
                        size="smallBlack"
                        onChange={handleCheckBoxSelection}>
                        <span className={styles.item}>{item.name}</span>
                      </Checkbox>
                      <span className={styles.itemCount}>{item.count}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <RideToButton
            className={styles.searchButton}
            onClick={handleSearchClick}>
            Search
          </RideToButton>
        </div>
      </ModalBody>
    </Modal>
  )
}
