import React from 'react'
import classnames from 'classnames'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock'

import styles from './SidePanel.scss'
import closeImg from 'assets/images/rideto/CloseCross.svg'

class SidePanel extends React.Component {
  constructor(props) {
    super(props)
    this.sidePanel = React.createRef()
  }

  componentDidMount() {
    const { mountUnmount } = this.props

    if (mountUnmount) {
      disableBodyScroll(this.sidePanel.current)
    }
  }

  componentDidUpdate(prevProps) {
    const { visible, mountUnmount } = this.props

    if (prevProps.visible !== visible && !mountUnmount) {
      if (visible) {
        disableBodyScroll(this.sidePanel.current)
      } else {
        enableBodyScroll(this.sidePanel.current)
      }
    }
  }

  componentWillUnmount() {
    const { mountUnmount } = this.props

    if (mountUnmount) {
      enableBodyScroll(this.sidePanel.current)
    } else {
      clearAllBodyScrollLocks()
    }
  }

  handleDismissed = () => {
    this.props.onDismiss()

    // const isMobile = window.innerWidth < 768 || window.screen.width < 768
    // if (isMobile) {
    //   const scrollY = localStorage.getItem('COURSE_INFO_SCROLL_Y')
    //   if (!isNaN(scrollY)) {
    //     window.scrollTo(0, parseInt(scrollY))
    //     localStorage.setItem('COURSE_INFO_SCROLL_Y', null)
    //   }
    // }
  }

  render() {
    const {
      children,
      visible,
      headingImage,
      footer,
      footerStatic = false
    } = this.props
    const headingStyle = { backgroundImage: `url(${headingImage})` }
    const className = classnames(
      styles.sidePanelWrapper,
      visible && styles.visible
    )

    return (
      <div className={className}>
        <div className={styles.overlay} onClick={this.handleDismissed} />
        <div className={styles.sidePanel} ref={this.sidePanel} id="sidepanel">
          <div className={styles.headingImage} style={headingStyle}>
            <img src={closeImg} alt="Close" onClick={this.handleDismissed} />
          </div>
          <div className={styles.content}>{children}</div>
          {footer && (
            <div
              className={classnames(
                styles.footer,
                footerStatic && styles.footerStatic
              )}>
              {footer}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default SidePanel
