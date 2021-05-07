import React from 'react'
import MaskedInput from 'react-text-mask'
import styles from './LicenceInput.scss'

const mask = [
  /[A-Za-z9]/, /[A-Za-z9]/, /[A-Za-z9]/, /[A-Za-z9]/, /[A-Za-z9]/, ' ',
  /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, ' ',
  /[A-Za-z9]/, /[A-Za-z9]/, ' ',
  /\d/, ' ',
  /[A-Za-z9]/, /[A-Za-z9]/
]

class LicenceInput extends React.Component {
  render() {
    const { value, label } = this.props

    if (label) {
      return (
        <label className={styles.label}>
          <span className={styles.spanLabel}>{label}</span>
          <MaskedInput
            {...this.props}
            className={styles.input}
            value={value}
            mask={mask}
            onChange={this.props.onChange}
          />
        </label>
      )
    }

    return (
      <MaskedInput
        {...this.props}
        className={styles.input}
        value={value}
        mask={mask}
        onChange={this.props.onChange}
      />
    )
  }
}

export default LicenceInput
