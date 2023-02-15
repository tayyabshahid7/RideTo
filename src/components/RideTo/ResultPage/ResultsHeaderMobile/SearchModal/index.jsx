import { dropdownLine, IconRadius, IconSearch } from 'assets/icons'
import IconLocale from 'assets/icons/IconLocate'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import Loading from 'components/Loading'
import Radiobox from 'components/Radiobox'
import RideToButton from 'components/RideTo/Button'
import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { parseQueryString } from 'services/api'
import styles from './styles.scss'

import { normalizePostCode } from 'utils/helper'
import { ResultPageProvider } from '../../StateProvider'

const options = [
  { value: '10', label: `+ 10 miles` },
  { value: '25', label: `+ 25 miles` },
  { value: '50', label: `+ 50 miles` },
  { value: '100', label: `+ 100 miles` }
]

const SearchModal = ({ isOpen, onClose, courseTypesOptions }) => {
  const {
    getPosition,
    postcode,
    timestamp,
    positionError,
    handleCourseTypeChange,
    courseType,
    radiusMiles
  } = useContext(ResultPageProvider)

  const [isLoading, setIsLoading] = useState(false)
  const [postcodeModal, setPostcodeModal] = useState('')

  const [radius, setRadius] = useState(options[0])

  const CloseButtonIcon = (
    <button onClick={onClose} className={styles.buttonClose}>
      <img src={CloseDark} alt="close-modal" />
    </button>
  )

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props} className={styles.boxSelectRadius}>
        <div className={styles.boxSelectRadiusIcon}>
          <IconRadius />
        </div>
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

  const onChangeValue = event => {
    handleCourseTypeChange(event.target.value)
  }

  function handleSearchClick() {
    const { filters } = parseQueryString(window.location.search.slice(1))

    const normalizedPostCode = normalizePostCode(postcodeModal)
    const sortByOption = 'distance'
    const formattedRadius = radius.value

    const formatedFilters = filters
      ? `&filters=${encodeURIComponent(filters)}`
      : ''
    window.location = `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType}&radius_miles=${formattedRadius}&sortBy=${sortByOption}${formatedFilters}&search=${true}`
  }

  function handleCurrentLocationClick() {
    if (!timestamp) {
      setIsLoading(true)
      getPosition()
    }
  }
  useEffect(() => {
    handleCourseTypeChange(courseType)
  }, [courseType])

  useEffect(() => {
    setPostcodeModal(postcode)
  }, [postcode])

  useEffect(() => {
    const filteredRadiusMiles = options.filter(
      radius => radius.value === radiusMiles
    )

    if (filteredRadiusMiles.length > 0) {
      setRadius(filteredRadiusMiles[0])
    } else {
      setRadius(options[3])
    }
  }, [radiusMiles])

  useEffect(() => {
    setIsLoading(false)
  }, [timestamp, setIsLoading, positionError])

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
        Search
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <>
          <span className={styles.courseTitle}>Course</span>
          {courseTypesOptions.map(course => {
            const { name, constant, number_of_suppliers } = course
            return (
              <div key={constant} className={styles.courseTypesWrapper}>
                {number_of_suppliers > 0 && (
                  <>
                    <Radiobox
                      id={constant}
                      onChange={onChangeValue}
                      checked={constant === courseType}
                      children={name}
                      extraClass={styles.inputRadio}
                      value={course.constant}
                    />
                    <span className={styles.coursesCounter}>
                      {number_of_suppliers}
                    </span>
                  </>
                )}
              </div>
            )
          })}

          <div className={styles.searchAreaWrapper}>
            <span className={styles.courseTitle}>Search Area</span>

            <span
              className={styles.currentLocation}
              onClick={handleCurrentLocationClick}>
              <IconLocale />
              Use current location
            </span>
          </div>
          <div className={styles.Box}>
            <label className={styles.boxSearchText}>
              <IconSearch className={styles.boxSearchIcon} />
              <input
                className={styles.boxSearchInput}
                type="text"
                value={postcodeModal}
                name="postcode"
                onChange={e => setPostcodeModal(e.target.value)}
              />
            </label>

            <img
              className={styles.searchCloseIcon}
              src={CloseDark}
              alt="close-modal"
            />
          </div>

          <span className={styles.courseTitle}>Radius</span>
          <Select
            defaultValue={radius}
            options={options}
            menuPlacement="auto"
            components={{
              Control,
              DropdownIndicator,
              IndicatorSeparator,
              SingleValue,
              Option
            }}
            onChange={r => setRadius(r)}
          />
          <Loading loading={isLoading} className={styles.loading}>
            <RideToButton
              className={styles.searchButton}
              onClick={handleSearchClick}>
              Search
            </RideToButton>
          </Loading>
        </>
      </ModalBody>
    </Modal>
  )
}

export default SearchModal
