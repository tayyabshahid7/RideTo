import React, { Component } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

export default class ConnectTextArea extends Component {
  constructor(props) {
    super(props)

    this.el = React.createRef()

    this.setHeight = this.setHeight.bind(this)
  }

  setHeight() {
    const { autoHeight } = this.props
    const textarea = this.el.current

    if (autoHeight) {
      textarea.style.height = ''
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  componentDidMount() {
    this.setHeight()
  }

  render() {
    const {
      label,
      name,
      value,
      type,
      disabled,
      onChange,
      noWrapLabel,
      autoHeight,
      noBorder
    } = this.props

    return (
      <div className={styles.formGroup}>
        {label && (
          <label
            className={classnames(
              styles.label,
              noWrapLabel && styles.labelNoWrap,
              disabled && styles.labelDisabled
            )}>
            {label}
          </label>
        )}
        <textarea
          ref={this.el}
          className={classnames(
            styles.textarea,
            autoHeight && styles.textareaAutoHeight,
            noBorder && styles.textareaNoBorder
          )}
          name={name}
          value={value}
          type={type}
          disabled={disabled}
          onChange={onChange}
          onInput={this.setHeight}
        />
      </div>
    )
  }
}
