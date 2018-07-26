import React, { Component } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

class Modal extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    // Put here any api calls to the backend
  }

  closeModal(e) {
    e && e.stopPropagation()
    this.props.history.goBack()
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>TITLE</div>
            <div className={styles.modalCloseButton} onClick={this.closeModal}>
              x
            </div>
          </div>
          <div className={styles.modalBody}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.modalActionButtons}>
              <button
                type="button"
                className={styles.button}
                onClick={this.closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Place this <Router path="[link path]" component={Modal}/>
// <Link to={'[path-here]'}>[text here]</Link>
export default Modal
