import { dropdownLine, IconRadius, IconSearch } from 'assets/icons'
import IconLocale from 'assets/icons/IconLocate'
import CloseDark from 'assets/images/rideto/CloseDark.svg'
import Loading from 'components/Loading'
import RideToButton from 'components/RideTo/Button'
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import Radiobox from '../../../../Radiobox'
import styles from './styles.scss'

import postcodes from 'node-postcodes.io'

const options = [
  { value: '0', label: `+ 0 miles` },
  { value: '10', label: `+ 10 miles` },
  { value: '20', label: `+ 20 miles` },
  { value: '30', label: `+ 30 miles` }
]

const optionsLocation = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

const SearchModal = ({ isOpen, onClose, onSearch, courseTypesOptions }) => {
  const [courseTypeState, setCourseTypeState] = useState('LICENCE_CBT')

  const [postcode, setPostcode] = useState('CR6 9EE')
  const [radius, setRadius] = useState(0)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      console.log('Loading state', isLoading)
      navigator.geolocation.getCurrentPosition(
        getCurrentLocationSuccess,
        getCurrentLocationError,
        optionsLocation
      )
      setLoading(false)
    }
  }, [isLoading])

  const getCurrentLocationSuccess = async pos => {
    // const crd = pos.coords

    // const lat = crd.latitude // 51.7923246977375
    // const lng = crd.longitude // 0.629834723775309

    const lat = 51.7923246977375
    const lng = 0.629834723775309

    console.log(lat, lng)

    try {
      let postcodeIo = await postcodes.geo(
        51.7923246977375,
        0.629834723775309,
        {
          limit: 1,
          radius: 1,
          wideSearch: false
        }
      )

      console.log(postcodeIo.result)
      if (postcodeIo.result.length > 0) {
        console.log('here')
        console.log(postcodeIo.result[0].postcode)
        setPostcode(postcodeIo.result[0].postcode)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getCurrentLocationError = err => {
    console.warn(`ERROR(${err.code}): ${err.message}`)
    setLoading(false)
  }

  const handleGetCurrentLocation = () => setLoading(true)

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
    setCourseTypeState(event.target.value)
  }

  const handleSearchClick = () => {
    onSearch(radius, postcode, courseTypeState)
  }

  return (
    <Modal isOpen={isOpen} backdrop="static" className={styles.modal}>
      <ModalHeader toggle={onClose} close={CloseButtonIcon}>
        Search
      </ModalHeader>
      <ModalBody>
        <div className={styles.modalBody}>
          <span className={styles.courseTitle}>Course</span>
          {courseTypesOptions.map((courseType, id) => {
            const { name, constant, number_of_suppliers } = courseType
            return (
              <div key={id} className={styles.courseTypesWrapper}>
                <Radiobox
                  id={constant}
                  onChange={onChangeValue}
                  checked={constant === courseTypeState}
                  children={name}
                  extraClass={styles.inputRadio}
                  value={courseType.constant}
                />
                <span className={styles.coursesCounter}>
                  {number_of_suppliers}
                </span>
              </div>
            )
          })}

          <div className={styles.searchAreaWrapper}>
            <span className={styles.courseTitle}>Search Area</span>

            <span
              className={styles.currentLocation}
              onClick={handleGetCurrentLocation}>
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
                value={postcode}
                name="postcode"
                onChange={e => setPostcode(e.target.value)}
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
            onChange={r => setRadius(r.value)}
          />
          <Loading loading={isLoading}>
            <RideToButton
              className={styles.searchButton}
              onClick={handleSearchClick}>
              Search
            </RideToButton>
          </Loading>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default SearchModal
