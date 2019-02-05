import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import LazySlide from './LazySlide'
import { getStaticData } from 'services/page'
import ArrowSlideLeft from 'assets/images/rideto/ArrowSlideLeft.svg'
import ArrowSlideRight from 'assets/images/rideto/ArrowSlideRight.svg'
import SidePanel from 'components/RideTo/SidePanel'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import styles from './CourseSlider.scss'
import { FULL_LICENCE_MODULES } from 'common/constants'

const NextArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.nextArrow)} onClick={onClick}>
    <img src={ArrowSlideRight} alt="" />
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.prevArrow)} onClick={onClick}>
    <img src={ArrowSlideLeft} alt="" />
  </div>
)

class CourseSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCourseType: null,
      detailsImage: null
    }

    this.handleDetails = this.handleDetails.bind(this)
  }

  handleDetails(selectedCourseType) {
    if (this.props.sidepanel) {
      this.setState({
        selectedCourseType,
        detailsImage: selectedCourseType
          ? selectedCourseType.details.image
          : null
      })
    } else {
      window.location.href = selectedCourseType.details.landing_page_url
    }
  }

  render() {
    const { sidepanel } = this.props
    const { selectedCourseType, detailsImage } = this.state
    const settings = {
      customPaging: i => {
        return (
          <button>
            <div className={styles.dot} />
          </button>
        )
      },
      dotsClass: styles.dots,
      className: styles.slider,
      dots: true,
      infinite: true,
      arrows: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '64px',
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            infinite: false,
            centerPadding: '12px'
          }
        }
      ]
    }

    const staticData = getStaticData('RIDETO_PAGE')
    const slides =
      staticData.courseTypes.filter(
        ({ constant }) => !FULL_LICENCE_MODULES.includes(constant)
      ) || []

    return (
      <React.Fragment>
        <RideToSlider settings={settings}>
          {slides.map((slide, index) => (
            <button key={index} onClick={() => this.handleDetails(slide)}>
              <LazySlide slide={slide} styles={styles} />
            </button>
          ))}
        </RideToSlider>
        {sidepanel && (
          <SidePanel
            visible={selectedCourseType !== null}
            headingImage={detailsImage}
            onDismiss={() => this.handleDetails(null)}>
            {selectedCourseType && (
              <CourseTypeDetails courseType={selectedCourseType} />
            )}
          </SidePanel>
        )}
      </React.Fragment>
    )
  }
}

export default CourseSlider
