import React, { Suspense } from 'react'
import { lazy } from '@loadable/component'
import classnames from 'classnames'
import { getStaticData } from 'services/page'
import styles from './CourseMenuItem.scss'
import { COURSETYPE_ORDER } from 'common/constants'

const CourseSlider = lazy(() => import('components/RideTo/CourseSlider'))

class CourseMenuItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      courseCardsVisible: false,
      courseLinksVisible: false
    }

    this.handleShowSlider = this.handleShowSlider.bind(this)
    this.handleHideSlider = this.handleHideSlider.bind(this)
    this.handleToggleCourseLinks = this.handleToggleCourseLinks.bind(this)
  }

  handleShowSlider(event) {
    event.preventDefault()
    event.stopPropagation()

    if (event.target === event.currentTarget) {
      if (!this.state.courseCardsVisible) {
        window.document.body.setAttribute(
          'style',
          'height:100%;overflow:hidden'
        )
      } else {
        window.document.body.setAttribute('style', '')
      }
      this.setState({ courseCardsVisible: !this.state.courseCardsVisible })
    }
  }

  handleHideSlider(event) {
    event.preventDefault()
    event.stopPropagation()
    window.document.body.setAttribute('style', '')
    this.setState({ courseCardsVisible: false })
  }

  handleToggleCourseLinks() {
    this.setState({ courseLinksVisible: !this.state.courseLinksVisible })
  }

  render() {
    const { courseLinksVisible, courseCardsVisible } = this.state

    const overlay = classnames(
      styles.overlay,
      courseCardsVisible ? styles.visible : null
    )
    const slider = classnames(
      styles.slider,
      courseCardsVisible ? styles.visible : null
    )

    const courseTypes =
      getStaticData('RIDETO_PAGE').courseTypes.filter(({ constant }) =>
        COURSETYPE_ORDER.includes(constant)
      ) || []

    return (
      <React.Fragment>
        <div
          onClick={this.handleToggleCourseLinks}
          className={classnames(styles.courseMenuItem, styles.hiddenOnDesktop)}>
          COURSES
        </div>
        {courseLinksVisible && (
          <div className={styles.courseMenuSubItem}>
            {courseTypes.map((courseType, index) => (
              <a
                key={index}
                href={courseType.details.landing_page_url}
                className={styles.courseMenuSublink}>
                {courseType.name}
              </a>
            ))}
          </div>
        )}
        <div
          onClick={this.handleShowSlider}
          className={classnames(styles.courseMenuItem, styles.hiddenOnMobile)}>
          COURSES
          {courseCardsVisible && (
            <div className={styles.courseMenu}>
              <div className={overlay} onClick={this.handleHideSlider} />
              <div className={slider}>
                <Suspense fallback={<div>Loading...</div>}>
                  <CourseSlider sidepanel={false} />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default CourseMenuItem
