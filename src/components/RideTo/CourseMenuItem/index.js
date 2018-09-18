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
      this.setState({ visible: !this.state.visible })
    }
  }

  handleHideSlider(event) {
    event.preventDefault()
    event.stopPropagation()
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
            <CourseSlider />
          </div>
        </div>
      </div>
    )
  }
}

export default CourseMenuItem
