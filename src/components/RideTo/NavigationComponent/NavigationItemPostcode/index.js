import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './NavigationItemPostcode.scss'
import Button from 'components/RideTo/Button'

class NavigationItemPostcode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      postcode: this.props.subtitle,
      editable: false,
      error: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleToggleEditable = this.handleToggleEditable.bind(this)
  }

  handleChange(event) {
    const newPostcode = event.target.value
    if (newPostcode.length > 0) {
      this.setState({ postcode: newPostcode, error: false })
    } else {
      this.setState({ postcode: newPostcode, error: true })
    }
  }

  handleClick() {
    if (this.state.postcode.length <= 0) {
      this.setState({ error: true })
      return
    } else if (this.props.subtitle !== this.state.postcode) {
      this.props.onPostcodeUpdate(this.state.postcode)
    } else {
      this.setState({ editable: false })
    }
  }

  handleToggleEditable() {
    const currentPage = window.location.pathname

    if (!this.state.editable && currentPage !== '/course-addons/') {
      this.setState({ editable: true })
    }
  }

  render() {
    const { title, fullWidth = false, className } = this.props

    const { postcode, editable, error } = this.state

    return (
      <div
        className={classnames(
          className,
          styles.navigationItem,
          styles.clickable,
          fullWidth && styles.fullWidth
        )}
        onClick={this.handleToggleEditable}>
        <div className={styles.title}>{title}</div>
        <div
          className={classnames(styles.subtitle, editable && styles.editable)}>
          {editable ? (
            <React.Fragment>
              <input
                className={classnames(error && styles.inputError)}
                type="text"
                onChange={this.handleChange}
                value={postcode}
                required
              />
              <Button
                className={styles.updateButton}
                onClick={this.handleClick}>
                Update
              </Button>
            </React.Fragment>
          ) : (
            postcode
          )}
        </div>
      </div>
    )
  }
}

export default NavigationItemPostcode
