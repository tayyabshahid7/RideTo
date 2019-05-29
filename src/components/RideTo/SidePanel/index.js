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

  render() {
    const {
      children,
      visible,
      headingImage,
      onDismiss,
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
        <div className={styles.overlay} onClick={onDismiss} />
        <div className={styles.sidePanel} ref={this.sidePanel}>
          <div className={styles.headingImage} style={headingStyle}>
            <img src={closeImg} alt="Close" onClick={onDismiss} />
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
