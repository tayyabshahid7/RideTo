import React from 'react'
import styles from './styles.scss'

class ShowMore extends React.Component {
  state = {
    open: false
  }

  render() {
    const { children, className } = this.props
    const { open } = this.state

    return (
      <div className={className}>
        <div className={open ? undefined : styles.hidden}>{children}</div>

        <div>
          <button
            className={styles.showMoreButton}
            onClick={() => {
              this.setState({
                open: !open
              })
            }}>
            Show {open ? 'less -' : 'more +'}
          </button>
        </div>
      </div>
    )
  }
}

export default ShowMore
