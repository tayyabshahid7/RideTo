import React, { Fragment } from 'react'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import Input from './Input'
import moment from 'moment'
import InfoBox from './InfoBox'
import MediaQuery from 'react-responsive'

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
      <div className={styles.background}>
        <div className={styles.container}>
          <div className={styles.main}>
            <div className={styles.titles}>
              <h2 className={styles.subtitle}>
                Book Motorcycle Training Near You
              </h2>
              <h1 className={styles.title}>
                {!isFullLicence
                  ? getCourseTitle(courseType)
                  : 'Motorcycle Licence'}{' '}
                {this.props.postcode}
              </h1>
            </div>
            <div className={styles.formGroupWrap}>
              <Input
                value={postcode}
                label="Postcode"
                icon="search"
                fullWidth={isFullLicence}
                onChange={this.handlePostcodeChange}
                onSubmit={this.handlePostcodeSubmit}
              />
              {!isFullLicence && (
                <Fragment>
                  <MediaQuery query="(min-width:  393px)">
                    <Input
                      value={
                        date ? moment(date).format('ddd d MMM') : 'Select date'
                      }
                      label="Date"
                      icon="date"
                      disabled
                      button
                      onClick={handleMobileDateClick}
                      className={styles.hideDesktop}
                    />
                  </MediaQuery>
                  <MediaQuery query="(max-width: 392px)">
                    <Input
                      value={date ? moment(date).format('ddd d MMM') : 'Date'}
                      label="Date"
                      icon="date"
                      disabled
                      button
                      onClick={handleMobileDateClick}
                      className={styles.hideDesktop}
                    />
                  </MediaQuery>
                </Fragment>
              )}
              <Input
                label="Course"
                value={courseType}
                select
                options={courseTypesOptions}
                onChange={this.handleCourseChange}
              />
              <InfoBox
                showCourseTypeInfo={showCourseTypeInfo}
                courseType={courseType}
                className={styles.hideDesktop}
              />

              <MediaQuery query="(min-width: 769px)">
                <InfoBox
                  showCourseTypeInfo={showCourseTypeInfo}
                  courseType={courseType}
                />
              </MediaQuery>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultsHeader
