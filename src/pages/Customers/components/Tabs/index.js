import React, { Component } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

class Tabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // activeTab: this.props.children[0].props.label // TODO TURN THIS OFF
      activeTab: this.props.children[1].props.label // TODO TURN THIS OFF
    }
  }

  isActive(label) {
    const { activeTab } = this.state
    return label === activeTab
  }

  updateActive(label) {
    this.setState({
      activeTab: label
    })
  }

  render() {
    const { children } = this.props

    return (
      <div>
        <div className={styles.tabRow}>
          {children.map(({ props: { label } }) => (
            <div
              className={classnames(
                styles.tab,
                this.isActive(label) && styles.activeTab
              )}
              key={label}>
              <button
                className={styles.tabButton}
                onClick={() => {
                  this.updateActive(label)
                }}>
                {label}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.panels}>
          {children.map(child => (
            <div
              key={child.props.label}
              className={classnames(
                styles.panel,
                this.isActive(child.props.label) && styles.showPanel
              )}>
              {child}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Tabs
