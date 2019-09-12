import React, { Component } from 'react'
import classnames from 'classnames'
import containerStyles from '../styles.scss'
import summaryStyles from '../BikeSummary/styles.scss'
import componentStyles from './styles.scss'
import Circle from 'react-circle'
import { getShortCourseType } from 'services/course'
import { SLUG_COURSE_TYPES } from 'common/constants'
import stickybits from 'stickybits'
import Helmet from 'react-helmet'

const styles = {
  ...containerStyles,
  ...summaryStyles,
  ...componentStyles
}

class BikeReview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentImage: 0,
      stuckSet: false
    }

    this.handleImageButtonClick = this.handleImageButtonClick.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.init = this.init.bind(this)

    this.keyInfo = React.createRef()
    this.rightPanel = React.createRef()
    this.content = React.createRef()
  }

  handleImageButtonClick(index) {
    this.setState({
      currentImage: index
    })
  }

  handleResize() {
    this.keyInfo.current.style.width = `${this.rightPanel.current.offsetWidth}px`
  }

  init() {
    if (
      !this.state.stuckSet &&
      this.keyInfo.current &&
      this.rightPanel.current
    ) {
      this.handleResize()

      window.addEventListener('resize', this.handleResize)

      this.stickybits = stickybits(this.keyInfo.current, {
        useFixed: true,
        stickyBitStickyOffset: 22
      })

      const content = this.content.current

      // Update stickybits for when images are loaded because they make the height wrong
      content.querySelectorAll('img').forEach(img => {
        img.onload = () => {
          this.stickybits.update()
        }
      })

      this.setState({
        stuckSet: true
      })
    }
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    const { match, bikes } = this.props
    const { currentImage } = this.state

    if (!bikes.length) {
      return null
    }

    const {
      images,
      name,
      price,
      bookLink,
      engine,
      bhp,
      mpg,
      intro,
      goodPoints,
      badPoints,
      bodyContent,
      score,
      range,
      requiredLicence,
      insuranceGroup
    } = bikes.find(bike => bike.slug === match.params.slug)
    const insuranceLink = 'http://tidd.ly/7b623335'
    const trainingLink = `/${Object.keys(SLUG_COURSE_TYPES).find(key => {
      return SLUG_COURSE_TYPES[key] === requiredLicence
    })}`
    const licenceText = `${getShortCourseType({
      constant: requiredLicence
    })} Licence`

    return (
      <div className={styles.page}>
        <Helmet>
          <title>Rideto | {name} Review</title>
        </Helmet>
        <div className={styles.container} style={{ position: 'relative' }}>
          <div className={styles.header}>
            <div className={styles.largeImage}>
              <img
                src={images[currentImage]}
                alt="Large product"
                width="611"
                height="318"
              />
              <ul className={styles.imagesList}>
                {images.map((image, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        this.handleImageButtonClick(i)
                      }}>
                      <img
                        src={image}
                        alt="Small product"
                        width="141"
                        height="73"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div ref={this.rightPanel} className={styles.rightPanel}>
              <div ref={this.keyInfo} className={styles.keyInfo}>
                <div className={styles.keyInfoHeader}>
                  <div>
                    <h1 className={styles.title}>{name}</h1>
                    <div className={styles.price}>
                      RRP £{(price / 100).toLocaleString()}
                    </div>
                  </div>
                  <div className={styles.score}>
                    <div>RideTo Score</div>
                    <div className={styles.circle}>
                      <span className={styles.scoreNum}>
                        {Math.round(score) / 10}/10
                      </span>
                      <Circle
                        progress={score}
                        roundedStrike={true}
                        progressColor="green"
                        animate={false}
                        responsive={true}
                        showPercentage={false}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  {engine} - {bhp} bhp
                </div>
                <div className={styles.infoRow}>
                  {mpg} MPG - {range} miles range
                </div>
                <div className={styles.infoRow}>
                  {licenceText}
                  <a href={trainingLink}>Book Course</a>
                </div>
                <div className={styles.infoRow} style={{ flexGrow: '1' }}>
                  Insurance group: {insuranceGroup}{' '}
                  <a href={insuranceLink}>Get Quote</a>
                </div>
                <a
                  className={classnames(
                    styles.button,
                    styles.buttonPrimary,
                    styles.buttonReview
                  )}
                  href={bookLink}>
                  Book test ride
                </a>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.content}>
              <h2 className={styles.title}>{name} Review</h2>
              <p>{intro}</p>
              <div className={styles.goodBad}>
                <div>
                  <div>
                    <h3>The good</h3>
                    <ul className={styles.good}>
                      {goodPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3>The not so good</h3>
                  <ul className={styles.bad}>
                    {badPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div
              ref={this.content}
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
            <div className={styles.footerButtons}>
              <a
                className={classnames(
                  styles.button,
                  styles.buttonPrimary,
                  styles.buttonReview
                )}
                href={bookLink}>
                Book test ride
              </a>
              <a
                className={classnames(
                  styles.button,
                  styles.buttonPrimary,
                  styles.buttonReview
                )}
                href={trainingLink}>
                Book {licenceText}
              </a>
              <a
                className={classnames(
                  styles.button,
                  styles.buttonPrimary,
                  styles.buttonReview
                )}
                href={insuranceLink}>
                Insurance quote
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BikeReview
