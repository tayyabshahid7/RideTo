import React from 'react'
import classnames from 'classnames'
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock'

import styles from './SidePanel.scss'
import closeImg from 'assets/images/rideto/CloseWhite.svg'

class SidePanel extends React.Component {
  constructor(props) {
    super(props)
    this.sidePanel = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props

    if (prevProps.visible !== visible) {
      if (visible) {
        disableBodyScroll(this.sidePanel.current)
      } else {
        enableBodyScroll(this.sidePanel.current)
      }
    }
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks()
  }

  render() {
    const { children, visible, headingImage, onDismiss, footer } = this.props
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
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    )
  }
}

export default SidePanel
