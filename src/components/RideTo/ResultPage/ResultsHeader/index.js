import React from 'react'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import Input from './Input'
import moment from 'moment'
import expandImg from 'assets/images/rideto/Expand.svg'

class ResultsHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      postcode: this.props.postcode
    }

    this.handlePostcodeChange = this.handlePostcodeChange.bind(this)
    this.handlePostcodeSubmit = this.handlePostcodeSubmit.bind(this)
    this.handleCourseChange = this.handleCourseChange.bind(this)
  }

  handlePostcodeChange({ target: { value } }) {
    this.setState({
      postcode: value
    })
  }

  handlePostcodeSubmit(event) {
    const { handlePostcodeChange } = this.props
    const { postcode } = this.state

    event.preventDefault()

    if (postcode.length > 0) {
      handlePostcodeChange(postcode)
    }
  }

  handleCourseChange({ target: { value } }) {
    const { handleCourseChange } = this.props

    handleCourseChange(value)
  }

  render() {
    const {
      courseType,
      date,
      courseTypesOptions,
      isFullLicence,
      handleMobileDateClick,
      showCourseTypeInfo
    } = this.props
    const { postcode } = this.state

    return (
      <React.Fragment>
        <div className={styles.infoBox}>
          <button className={styles.infoButton} onClick={showCourseTypeInfo}>
            <span>
              <span className={styles.infoCircle}>
                <i className="fa fa-info-circle"></i>
              </span>{' '}
              What is {getCourseTitle(courseType)}
              {!getCourseTitle(courseType).includes('Training') && ' Training'}?
            </span>
            <img src={expandImg} alt="Open" />
          </button>
        </div>
        <div className={styles.container}>
          <div className={styles.main}>
            <h1 className={styles.title}>
              {!isFullLicence
                ? getCourseTitle(courseType)
                : 'Motorcycle Licence'}{' '}
              {this.props.postcode}
            </h1>
            <Input
              value={postcode}
              label="Postcode"
              onChange={this.handlePostcodeChange}
              onSubmit={this.handlePostcodeSubmit}
            />
            <Input
              value={courseType}
              label="Course"
              select
              chevron
              options={courseTypesOptions}
              onChange={this.handleCourseChange}
            />
            {!isFullLicence && (
              <Input
                value={
                  date ? moment(date).format('ddd Do MMMM') : 'Select date'
                }
                label="Date"
                chevron
                disabled
                button
                onClick={handleMobileDateClick}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ResultsHeader
