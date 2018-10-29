import React from 'react'
import classnames from 'classnames'

import CourseSlider from 'components/RideTo/CourseSlider'
import styles from './CourseMenuItem.scss'

class CourseMenuItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }

    this.handleShowSlider = this.handleShowSlider.bind(this)
    this.handleHideSlider = this.handleHideSlider.bind(this)
  }

  handleShowSlider(event) {
    event.preventDefault()
    event.stopPropagation()

    if (event.target === event.currentTarget) {
      if (!this.state.visible) {
        window.document.body.setAttribute(
          'style',
          'height:100%;overflow:hidden'
        )
      } else {
        window.document.body.setAttribute('style', '')
      }
      this.setState({ visible: !this.state.visible })
    }
  }

  handleHideSlider(event) {
    event.preventDefault()
    event.stopPropagation()
    window.document.body.setAttribute('style', '')
    this.setState({ visible: false })
  }

  render() {
    const overlay = classnames(
      styles.overlay,
      this.state.visible ? styles.visible : null
    )
    const slider = classnames(
      styles.slider,
      this.state.visible ? styles.visible : null
    )

    return (
      <div onClick={this.handleShowSlider} className={styles.courseMenuItem}>
        COURSES
        <div className={styles.courseMenu}>
          <div className={overlay} onClick={this.handleHideSlider} />
          <div className={slider}>
            <CourseSlider sidepanel={true} />,
          </div>
        </div>
      </div>
    )
  }
}

export default CourseMenuItem
