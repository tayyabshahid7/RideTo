import React from 'react'
import { Link } from 'react-router-dom'

import Checkbox from 'components/Checkbox'
import Input from 'components/RideTo/Input'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import { saveUser } from 'services/user'
import styles from './SignupPage.scss'

class SignupPage extends React.Component {
  constructor(props) {
    super(props)

    this.navigation = [
      {
        title: 'Sign up to RideTo',
        subtitle: (
          <div className={styles.navigation}>
            If you already have an account you can{' '}
            <Link to="/account/login">log in</Link>
          </div>
        )
      }
    ]

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      errors: {},
      terms: false,
      newsletter: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBack() {
    const { history } = this.props
    history.goBack()
  }

  handleChange({ target }) {
    const { name, value } = target
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: false
      }
    })
  }

  handleCheck({ target }) {
    const { name, checked } = target
    this.setState({
      [name]: checked,
      errors: {
        ...this.state.errors,
        [name]: false
      }
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const { terms, first_name, last_name, email, password } = this.state

    if (!terms) {
      this.setState({ errors: { terms: true } })
      return
    }

    try {
      await saveUser({ first_name, last_name, email, password })
      const next = JSON.parse(sessionStorage.getItem('login-next'))
      window.location.href = next
    } catch (error) {
      const { response } = error
      if (response) {
        const { data } = response
        const errors = Object.keys(data).reduce((errors, key) => {
          return {
            ...errors,
            [key]: data[key][0]
          }
        }, {})

        this.setState({
          errors: {
            ...this.state.errors,
            ...errors
          }
        })
      }
    }
  }

  render() {
    const {
      last_name,
      first_name,
      email,
      password,
      terms,
      newsletter,
      errors
    } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavBack={this.handleBack}
        />
        <div className={styles.signupPage}>
          <h2 className={styles.heading}>sign up to rideto</h2>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <Input
              placeholder="First Name"
              name="first_name"
              value={first_name}
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            {errors.first_name && (
              <div className={styles.error}>{errors.first_name}</div>
            )}
            <Input
              placeholder="Last Name"
              name="last_name"
              value={last_name}
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            {errors.last_name && (
              <div className={styles.error}>{errors.last_name}</div>
            )}
            <Input
              placeholder="Email"
              name="email"
              value={email}
              type="email"
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
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
              size="large"
              onChange={this.handleCheck}
              checked={newsletter}
              name="newsletter">
              Join the RideTo community newsletter to be invited to weekly ride
              outs, events and special offers.
            </Checkbox>

            <Checkbox
              extraClass={styles.checkbox}
              onChange={this.handleCheck}
              size="large"
              error={errors.terms}
              checked={terms}
              name="terms">
              I confirm I have read and accept RideTo’s terms & conditions and
              agree to RideTo’s condition of use & sale.
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
