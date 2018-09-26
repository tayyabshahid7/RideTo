import React from 'react'

import Checkbox from 'components/Checkbox'
import Input from 'components/RideTo/Input'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import styles from './SignupPage.scss'

class SignupPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      navigation: [
        {
          title: 'Sign up to RideTo',
          subtitle: 'If you already have an account you can log in'
        }
      ],
      name: '',
      email: '',
      password: '',
      terms: false,
      newsletter: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  handleBack() {
    console.log('back')
  }

  handleChange({ target }) {
    const { name, value } = target
    this.setState({
      [name]: value
    })
  }

  handleCheck({ target }) {
    const { name, checked } = target
    this.setState({
      [name]: checked
    })
  }

  render() {
    const { navigation, name, email, password, terms, newsletter } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={navigation}
          onNavBack={this.handleBack}
          onNavClick={this.handleNavigation}
        />
        <div className={styles.signupPage}>
          <h2 className={styles.heading}>sign up to rideto</h2>
          <form className={styles.form}>
            <Input
              placeholder="Name"
              name="name"
              value={name}
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            <Input
              placeholder="Email"
              name="email"
              value={email}
              type="email"
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            <Input
              placeholder="Password"
              name="password"
              value={password}
              type="password"
              className={styles.input}
              onChange={this.handleChange}
              pattern="(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Za-z]).*$"
              required
            />

            <div className={styles.subtext}>
              At least six characters, including a letter and a number
            </div>

            <Checkbox
              extraClass={styles.checkbox}
              onChange={this.handleCheck}
              size="large"
              checked={terms}
              name="terms">
              I confirm I have read and accept RideTo’s terms & conditions and
              agree to RideTo’s condition of use & sale.
            </Checkbox>

            <Checkbox
              extraClass={styles.checkbox}
              size="large"
              onChange={this.handleCheck}
              checked={newsletter}
              name="newsletter">
              Join the RideTo community newsletter to be invited to weekly ride
              outs, events and special offers.
            </Checkbox>

            <button type="submit" className={styles.signup}>
              <span>Create Account</span>
              <img src={ButtonArrowWhite} alt="" />
            </button>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default SignupPage
