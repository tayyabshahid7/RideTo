import React from 'react'
import MaskedInput from 'react-text-mask'
import styles from './DateInput.scss'

class DateInput extends React.Component {
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
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            size="7"
            onChange={this.props.onChange}
            placeholder="DD/MM/YY"
            type="tel"
          />
        </label>
      )
    }

    return (
      <MaskedInput
        {...this.props}
        className={styles.input}
        value={value}
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        size="7"
        onChange={this.props.onChange}
      />
    )
  }
}

export default DateInput
