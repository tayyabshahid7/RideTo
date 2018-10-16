import React from 'react'
import MaskedInput from 'react-maskedinput'
import styles from './PhoneInput.scss'

class PhoneInput extends React.Component {
  render() {
    const { value } = this.props
    return (
      <MaskedInput
        {...this.props}
        className={styles.input}
        value={value}
        mask="+44n111111111"
        onChange={this.props.onChange}
        formatCharacters={{
          n: {
            validate: function(char) {
              return /[1-9]/.test(char)
            }
          }
        }}
      />
    )
  }
}

export default PhoneInput
