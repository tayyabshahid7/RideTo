import React from 'react'
import MaskedInput from 'react-maskedinput'
import styles from './DateInput.scss'

class DateInput extends React.Component {
  render() {
    const { value } = this.props
    return (
      <MaskedInput
        {...this.props}
        className={styles.input}
        value={value}
        mask="11/11/1111"
        size="7"
        onChange={this.props.onChange}
      />
    )
  }
}

export default DateInput
