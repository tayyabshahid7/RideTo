import React from 'react'
import classnames from 'classnames'

import styles from './SidePanel.scss'
import closeImg from 'assets/images/rideto/CloseWhite.svg'

class SidePanel extends React.Component {
  componentDidUpdate(prevProps) {
    const { visible } = this.props

    if (prevProps.visible !== visible) {
      if (visible) {
        window.document.body.setAttribute(
          'style',
          'height:100%;overflow:hidden'
        )
      } else {
        window.document.body.setAttribute('style', '')
      }
    }
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
        <div className={styles.sidePanel}>
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
