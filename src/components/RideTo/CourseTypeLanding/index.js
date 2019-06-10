import React from 'react'
import styles from './styles.scss'
import Script from 'react-load-script'
import classnames from 'classnames'
import fastTrack from 'assets/images/fast-track.png'
import ShowMore from './ShowMore'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import { getStaticData } from 'services/page'
import fullLicenceBookImage from 'assets/images/FullLicenceTypeImage.jpg'
import infoGraphic from 'assets/images/infographic-website@2x.png'

const SLUG_COURSE_TYPES = {
  'introduction-to-motorcycling': 'INTRO_TO_MOTORCYCLING',
  'cbt-training': 'LICENCE_CBT',
  'blog/cbt-renewal': 'LICENCE_CBT_RENEWAL',
  'motorcycle-licence': 'FULL_LICENCE',
  '1-2-1-motorcycle-skills': 'TFL_ONE_ON_ONE',
  'full-licence-info': 'FULL_LICENCE' // dev only
}

const LOCATIONS = {
  full: [
    'london',
    'birmingham',
    'swansea',
    'bristol',
    'essex',
    'exeter',
    'portsmouth',
    'cardiff',
    'chelmsford',
    'brighton'
  ],
  cbt: [
    'london',
    'gasgow',
    'liverpool',
    'manchester',
    'birmingham',
    'bournemouth',
    'brighton',
    'cardiff',
    'leeds',
    'bristol',
    'portsmouth'
  ]
}

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
  }

  handleInputChange({ target: { value: search } }) {
    this.setState({
      search
    })
  }

  handleSubmit(event) {
    const { courseType, search } = this.state

    window.location = `/course-location/?postcode=${search}&courseType=${
      courseType.constant
    }`

    event.preventDefault()
  }

  render() {
    const { courseType, search } = this.state

    return (
      <React.Fragment>
        <section>
          <header className={styles.header}>
            <div className={styles.container}>
              <div className={styles.headerInner}>
                <div className={styles.headerInfo}>
                  <h1>Full Motorcycle Licence Course</h1>
                  <h2>
                    A multi day course with 2 tests so you can:
                    <br />
                    - Remove L plates
                    <br />
                    - Carry passengers
                    <br />- Ride on motorways
                  </h2>
                  <div className={styles.proof}>
                    <div
                      className={classnames(
                        'trustpilot-widget',
                        styles.headerTrust
                      )}
                      data-locale="en-GB"
                      data-template-id="5419b6a8b0d04a076446a9ad"
                      data-businessunit-id="59832d5f0000ff0005a80d6b"
                      data-style-height="24px"
                      data-style-width="250px"
                      data-theme="light">
                      <a
                        href="https://uk.trustpilot.com/review/rideto.com"
                        target="_blank"
                        rel="noopener noreferrer">
                        Trustpilot
                      </a>
                    </div>
                    <span>10,500 courses sold</span>
                  </div>
                </div>
                <div className={styles.bookInfo}>
                  <img src={fullLicenceBookImage} alt="Placeholder" />
                  <div className={styles.bookInfoText}>
                    <h4>Book a local instructor</h4>
                    <form
                      className={styles.bookForm}
                      onSubmit={this.handleSubmit}>
                      <input
                        onChange={this.handleInputChange}
                        placeholder="Your postcode"
                        type="text"
                        value={search}
                      />
                      <button>Search</button>
                    </form>
                    <h5>We include as standard:</h5>
                    <ul>
                      <li>Bike &amp; helmet hire</li>
                      <li>Test fees &amp; fuel</li>
                      <li>Online pre-training</li>
                      <li>Free cancellation</li>
                      <li>135 training locations UK wide</li>
                      <li>Dedicated support team</li>
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
          </header>
          <div className={styles.container}>
            <div className={styles.mainBody}>
              <div>
                <h2>What you'll learn</h2>
                <h3> How to ride the bike for your licence (A1, A2, A)</h3>
                <p>
                  You'll learn to ride and pass the tests on the right bike for
                  the licence you wish to obtain. either an A1, A2 or A
                  (unrestricted) licence depending on your age and the bike you
                  take the tests on.
                </p>
                <h3>Module 1: Maneuvers</h3>
                <p>
                  Off road riding; learning the test exercises such as riding in
                  a figure of 8, emergency stop and turn in the road.
                </p>
                <h3> Module 2: Theory Questions</h3>
                <p>
                  The ‘show me tell me' questions an examiner might ask you
                  about bike maintenance and safety.
                </p>
                <h3> Module 2: Road Riding Skills</h3>
                <p>
                  Riding in a variety of road conditions under directions from
                  the examiner as well as following signs, carrying out normal
                  stops, pulling away from behind a park car and a hill start.
                </p>
              </div>
              <a href="/">
                <img
                  src={fastTrack}
                  className={styles.fastTrackAdvert}
                  alt="Full licence fast-track package"
                />
              </a>
              <div>
                <h2>Requirements</h2>
                <p>
                  In order to take the full motorcycle licence course, you must
                  meet the following requirements:
                </p>
                <p>
                  Have the correct licence card: UK driving, UK provisional or
                  EU licence with UK counterpart licence number
                </p>
                <ul>
                  <li>
                    Hold a valid CBT certificate Hold a valid motorcycle theory
                  </li>
                  <li>
                    certificate Be able to read a registration plate from 20.5
                  </li>
                  <li>
                    meters Speak and understand English and the Highway code Be
                  </li>
                  <li>
                    able to ride an adult sized bicycle Wear suitable clothing
                  </li>
                  <li>including sturdy jeans and boots</li>
                </ul>
              </div>
              <div>
                <h2>What you can ride after</h2>
                <p>
                  A Motorcycle licence allows you pillion passenger and ride on
                  motorways.
                </p>
                <p>
                  Depending on your age and the bike you train on will decide
                  what you can ride after.
                </p>
                <ShowMore>
                  <p>
                    At 16 years old you can get an "AM" licence to ride a
                    motorcycle or scooter up 50cc, restricted to 28Mph
                  </p>
                  <p>
                    At 17 - 18 years old you can get an "A1" licence to ride a
                    motorcycle or scooter up 125cc
                  </p>
                  <p>
                    At 19 - 23 years old you can get an "A2" licence to ride a
                    motorcycle or scooter up 35 Kw of power
                  </p>
                  <p>
                    At 24 years old and above you can get a full unrestricted
                    "A" licence to ride a motorcycle or scooter of any power
                  </p>
                  <p>
                    If you take the tests on an automatic geared scooter or
                    motorcycle, you'll be restricted to only ride automatic
                    bikes. Passing on a manual geared bike allows you to ride
                    both
                  </p>
                </ShowMore>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <img src={infoGraphic} alt="Info graphic" />
              </div>
              <div>
                <h2>Course details</h2>
                <p>
                  The full motorcycle licence course combines the training and
                  tests for the two motorcycle tests, known as module 1 and
                  module 2.
                </p>
                <p>
                  Module 1 is an off-road test to assess your handling and and
                  control of the bike.
                </p>
                <p>
                  Module 2 is an on-road test, similar to the car driving test.
                  You'll ride through a variety of road conditions under
                  assessment from an examiner following on a motorcycle.
                </p>
                <ShowMore>
                  <p>
                    The official list of maneuvers for Module 1 is as follows:
                  </p>
                  <ul>
                    <li>
                      Wheeling the moped or motorcycle and using the stand
                      Riding a slalom and figure of 8.
                    </li>
                    <li>
                      A slow ride - being able to ride - and balance - a bike at
                      walking speed, using clutch and brake control
                    </li>
                    <li>
                      A U-turn - to ride and turn the bike around in the space
                      of a normal road
                    </li>
                    <li>Cornering and a controlled stop</li>
                    <li>Cornering and an emergency stop</li>
                    <li>Cornering and hazard avoidance</li>
                  </ul>
                  <p>
                    For Module 2 you'll be asked to ride across various local
                    roads and within differing traffic conditions and whilst
                    riding you'll be asked to carry out a few different
                    maneuvers:
                  </p>
                  <ul>
                    <li>A normal stop</li>
                    <li>
                      An angled start (pulling out safely from behind a parked
                      vehicle)
                    </li>
                    <li>
                      A hill start (where possible, not everywhere has hills!)
                    </li>
                  </ul>
                  <p>
                    The examiner will give you directions using a one-way radio
                    worn on your ear. They'll normally follow you on a
                    motorcycle in much the same way as your instructor will do
                    during your training.
                  </p>
                  <p>
                    The final part of module 2 is around 10 minutes of
                    independent riding. This is designed to assess your ability
                    to ride safely while making your own decisions so you can
                    expect the examiner to give you a destination (or a series
                    of turn instructions) and then they will follow behind to
                    assess your riding.
                  </p>
                </ShowMore>
              </div>
              <div>
                <h2>Frequently Asked Questions</h2>
                <CourseTypeDetails courseType={courseType} minimal />
              </div>
              <div>
                <h2>Cancellation policy</h2>
                <p>
                  Once your booking is confirmed, we can cancel and refund you
                  in full as long as you give us at least 12 working days notice
                  before your training starts.
                </p>
              </div>
              <div>
                <h2>Popular Full Motorcycle</h2>
                <ul className={styles.locationList}>
                  {LOCATIONS['full'].slice(0, 5).map(location => (
                    <li className={styles.location} key={location}>
                      <a
                        href={`/course-location/?postcode=${location}&courseType=${
                          courseType.constant
                        }`}>
                        {location}
                      </a>
                    </li>
                  ))}
                </ul>
                {LOCATIONS['full'].length > 5 && (
                  <ShowMore className={styles.showMoreLocations}>
                    <ul className={styles.locationList}>
                      {LOCATIONS['full'].slice(5).map(location => (
                        <li className={styles.location} key={location}>
                          <a
                            href={`/course-location/?postcode=${location}&courseType=${
                              courseType.constant
                            }`}>
                            {location}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </ShowMore>
                )}
              </div>
            </div>
          </div>
        </section>
        <Script url="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" />
      </React.Fragment>
    )
  }
}

export default CourseTypeLanding
