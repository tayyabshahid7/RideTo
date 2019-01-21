import React from 'react'
// import MaskedInput from 'react-maskedinput'
// import BasicPhoneInput from 'react-phone-number-input/basic-input'
import 'react-phone-number-input/style.css'
import BasicPhoneInput from 'react-phone-number-input'
import styles from './PhoneInput.scss'

// <MaskedInput
// {...this.props}
// className={styles.input}
// value={value}
// mask="+44n111111111"
// onChange={this.props.onChange}
// formatCharacters={{
// n: {
// validate: function(char) {
// return /[1-9]/.test(char)
// }
// }
// }}
///>

class PhoneInput extends React.Component {
  render() {
    const { value } = this.props
    return (
      <BasicPhoneInput
        {...this.props}
        inputClassName={styles.input}
        value={value}
        onChange={this.props.onChange}
        country="GB"
        countries={['GB']}
        international={false}
        showCountrySelect={false}
      />
    )
  }
}

export default PhoneInput
