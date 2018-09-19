import React from 'react'
import classnames from 'classnames'

import styles from './SidePanel.scss'

class SidePanel extends React.Component {
  render() {
    const { visible, headingImage, onDismiss } = this.props
    const headingStyle = { backgroundImage: `url(${headingImage})` }
    const className = classnames(
      styles.sidePanelWrapper,
      visible && styles.visible
    )

    return (
      <div className={className}>
        <div className={styles.overlay} onClick={onDismiss} />
        <div className={styles.sidePanel}>
          <div className={styles.headingImage} style={headingStyle} />
        </div>
      </div>
    )
  }
}

export default SidePanel
