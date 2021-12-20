import {
  CONTENT,
  SLUG_COURSE_TYPES,
  getLocations,
  landingPageUrl
} from './contents'

import CourseTypeLandingForm from './CourseTypeLandingForm'
import { Helmet } from 'react-helmet'
import MediaQuery from 'react-responsive'
import React from 'react'
import Script from 'react-load-script'
import ShowMore from './ShowMore'
import classnames from 'classnames'
import { getCourseTitle } from 'services/course'
import { getStaticData } from 'services/page'
import { normalizePostCode } from 'utils/helper'
import styles from './styles.scss'

class CourseTypeLanding extends React.Component {
  constructor(props) {
    super(props)

    const {
      location: { pathname }
    } = window

    const courseTypeConstant = SLUG_COURSE_TYPES[pathname.replace('/', '')]
    const { courseTypes } = getStaticData('RIDETO_PAGE')
    const courseType = courseTypes.find(
      courseType => courseType.constant === courseTypeConstant
    )

    this.state = {
      courseType,
      search: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.header = React.createRef()
    this.background = React.createRef()
  }

  handleInputChange({ target: { value: search } }) {
    this.setState({
      search
    })
  }

  componentDidMount() {
    this.handleResize()

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    const height = `${this.header.current.offsetHeight}px`

    this.background.current.style.height = height
  }

  handleSubmit(event) {
    const { courseType, search } = this.state

    event.preventDefault()

    if (courseType.constant === 'TFL_ONE_ON_ONE') {
      window.location = 'https://rideto.typeform.com/to/axybpw'
      return
    }
    const normalizedPostCode = normalizePostCode(search)

    window.location = `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType.constant}`
  }

  render() {
    const { courseType, search } = this.state
    const { header, body } = CONTENT[courseType.constant]

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {courseType.constant === 'FULL_LICENCE'
              ? 'Motorcycle Full Licence'
              : getCourseTitle(courseType.constant)}{' '}
            | RideTo
          </title>
        </Helmet>
        <div ref={this.background} className={styles.background} />
        <div>
          <section
            className={styles.container}
            style={{ position: 'relative' }}>
            <header className={styles.header} ref={this.header}>
              <div>
                <div className={styles.headerInner}>
                  <div className={styles.headerInfo}>
                    {header(courseType)}
                    <div className={styles.proof}>
                      {courseType.constant !== 'TFL_ONE_ON_ONE' && (
                        <span>
                          {courseType.constant === 'FULL_LICENCE'
                            ? '1,500'
                            : courseType.constant === 'LICENCE_CBT_RENEWAL'
                            ? '7,500'
                            : courseType.constant === 'INTRO_TO_MOTORCYCLING'
                            ? '5,500'
                            : '25,500'}{' '}
                          courses sold
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.bookInfoWrap}>
                    <div className={styles.bookInfo}>
                      <img
                        className={styles.bookingImage}
                        src={courseType.details.image}
                        alt="Placeholder"
                      />
                      <div className={styles.bookInfoText}>
                        <CourseTypeLandingForm
                          search={search}
                          handleSubmit={this.handleSubmit}
                          handleInputChange={this.handleInputChange}
                        />
                        <h5>We include as standard:</h5>
                        <ul>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            Bike
                          </li>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            Test fees &amp; fuel
                          </li>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            Online pre-training
                          </li>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            Flexible cancellation
                          </li>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            135 training locations UK wide
                          </li>
                          <li>
                            <span className={styles.tick}>
                              <i className="fa fa-check" />
                            </span>{' '}
                            Dedicated support team
                          </li>
                        </ul>
                        <div
                          className={classnames(
                            'trustpilot-widget',
                            styles.bookTrust
                          )}
                          data-locale="en-GB"
                          data-template-id="5419b6a8b0d04a076446a9ad"
                          data-businessunit-id="59832d5f0000ff0005a80d6b"
                          data-style-height="24px"
                          data-style-width="100%"
                          data-theme="light">
                          <a
                            href="https://uk.trustpilot.com/review/rideto.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            Trustpilot
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div>
              <div className={styles.mainBody}>
                {body(courseType)}
                <div>
                  <h2>
                    {courseType.constant !== 'TFL_ONE_ON_ONE' && 'Popular'}{' '}
                    {getCourseTitle(courseType.constant)} Locations
                  </h2>
                  <ul className={styles.locationList}>
                    {getLocations(courseType)
                      .slice(0, 5)
                      .map(location => (
                        <li className={styles.location} key={location}>
                          <a
                            href={
                              courseType.constant !== 'TFL_ONE_ON_ONE'
                                ? landingPageUrl(location, courseType)
                                : 'https://rideto.typeform.com/to/axybpw'
                            }>
                            {location}
                          </a>
                        </li>
                      ))}
                  </ul>
                  {getLocations(courseType).length > 5 && (
                    <ShowMore className={styles.showMoreLocations}>
                      <ul className={styles.locationList}>
                        {getLocations(courseType)
                          .slice(5)
                          .map(location => (
                            <li className={styles.location} key={location}>
                              <a href={landingPageUrl(location, courseType)}>
                                {location}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </ShowMore>
                  )}
                </div>
                <MediaQuery maxWidth={767}>
                  <div className={styles.bottomSearch}>
                    <CourseTypeLandingForm
                      search={search}
                      handleSubmit={this.handleSubmit}
                      handleInputChange={this.handleInputChange}
                    />
                  </div>
                </MediaQuery>
              </div>
            </div>
          </section>
        </div>
        <Script url="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" />
      </React.Fragment>
    )
  }
}

export default CourseTypeLanding
