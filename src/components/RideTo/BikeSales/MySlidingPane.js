import React, { Component } from 'react'
import SlidingPane from 'react-sliding-pane-spread-props'
import styles from './styles.scss'
import 'react-sliding-pane-spread-props/dist/react-sliding-pane.css'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import classnames from 'classnames'

class MySlidingPane extends Component {
  constructor(props) {
    super(props)

    this.pane = React.createRef()
  }

  render() {
    const {
      isOpen,
      children,
      title,
      filtersCount,
      clearFilters,
      closeFilters,
      width
    } = this.props
    const isFilters = title === 'Filters'

    return (
      <SlidingPane
        {...this.props}
        isOpen={isOpen}
        width={width}
        className={styles.panel}
        overlayRef={pane => (this.pane = pane)}
        onAfterOpen={() => {
          disableBodyScroll(this.pane)
        }}
        onAfterClose={() => {
          clearAllBodyScrollLocks()
        }}>
        <div className={styles.slidingPaneContent}>
          <div className={styles.slidingPaneTitle}>
            {isFilters && (
              <button
                className={classnames(
                  styles.clearAll,
                  filtersCount > 0 && styles.clearAllReady
                )}
                onClick={clearFilters}>
                Clear all {filtersCount > 0 && <span>({filtersCount})</span>}
              </button>
            )}
            <span>{title}</span>
            <button
              className={classnames(
                styles.close,
                !isFilters && styles.closeSort
              )}
              onClick={closeFilters}>
              ×
            </button>
          </div>
          <div className={styles.accordionContent}>{children}</div>
          <div className={styles.seeButtonWrap}>
            <button className={styles.seeButton} onClick={closeFilters}>
              See bikes
            </button>
          </div>
        </div>
      </SlidingPane>
    )
  }
}

export default MySlidingPane
