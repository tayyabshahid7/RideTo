import React from 'react'
import classnames from 'classnames'

import styles from './SidePanel.scss'
import closeImg from 'assets/images/rideto/CloseWhite.svg'

class SidePanel extends React.Component {
  render() {
    const { children, visible, headingImage, onDismiss } = this.props
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
        </div>
      </div>
    )
  }
}

export default SidePanel
