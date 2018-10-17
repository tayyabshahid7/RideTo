import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './NavigationItemPostcode.scss'
import Button from 'components/RideTo/Button'

class NavigationItemPostcode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      postcode: this.props.subtitle,
      editable: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleToggleEditable = this.handleToggleEditable.bind(this)
  }

  handleChange(event) {
    this.setState({ postcode: event.target.value })
  }

  handleClick() {
    if (this.props.subtitle !== this.state.postcode) {
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

    const { postcode, editable } = this.state

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
                type="text"
                onChange={this.handleChange}
                value={postcode}
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
