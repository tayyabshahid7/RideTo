import React from 'react'
import { Link } from 'react-router-dom'

import Checkbox from 'components/Checkbox'
import Input from 'components/RideTo/Input'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import { saveUser } from 'services/user'
import styles from './SignupPage.scss'
import classnames from 'classnames'
import Loading from 'components/Loading'

const isMobile = () => {
  return window.innerWidth < 768 || window.screen.width < 768
}

class SignupPage extends React.Component {
  constructor(props) {
    super(props)

    this.navigation = [
      {
        title: isMobile() ? 'Go Back' : 'Checkout',
        subtitle: (
          <div className={styles.navigation}>
            If you already have an account you can{' '}
            <Link to="/account/login">log in</Link>
          </div>
        )
      }
    ]

    this.loginNext = JSON.parse(sessionStorage.getItem('login-next'))

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      errors: {},
      terms: false,
      newsletter: false,
      hasCheckoutData:
        this.loginNext &&
        this.loginNext.endsWith('/checkout') &&
        JSON.parse(sessionStorage.getItem('checkout-data')),
      loading: false
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
    const {
      terms,
      first_name,
      last_name,
      email,
      password,
      newsletter
    } = this.state
    const pattern = /(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Za-z]).*$/

    if (!password.match(pattern)) {
      this.setState({ errors: { password: true } })
      return
    }

    if (!terms) {
      this.setState({ errors: { terms: true } })
      return
    }

    this.setState({
      loading: true
    })

    try {
      await saveUser({
        first_name,
        last_name,
        email,
        password,
        email_optin: newsletter
      })
      const next = this.loginNext || '/account/dashboard'
      window.location.href = next
    } catch (error) {
      const { response } = error
      this.setState({
        loading: false
      })
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
      errors,
      hasCheckoutData,
      loading
    } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={
            hasCheckoutData ? this.navigation : [{ title: '', subtitle: '' }]
          }
          onNavBack={this.handleBack}
        />
        <div className={styles.signupPage}>
          <h2 className={styles.heading}>
            Create Account{hasCheckoutData && ' & Checkout'}
          </h2>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <Input
              placeholder="First Name"
              name="first_name"
              value={first_name}
              className={classnames(
                styles.input,
                errors.first_name && styles.inputError
              )}
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
              className={classnames(
                styles.input,
                errors.last_name && styles.inputError
              )}
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
              className={classnames(
                styles.input,
                errors.email && styles.inputError
              )}
              onChange={this.handleChange}
              required
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
            <Input
              placeholder="Password"
              name="password"
              value={password}
              type="password"
              className={classnames(
                styles.input,
                errors.password && styles.inputError
              )}
              onChange={this.handleChange}
              required
            />
            <div
              className={classnames(
                styles.subtext,
                errors.password && styles.error
              )}>
              Min. six characters including 1 letter and 1 number
            </div>

            <Checkbox
              extraClass={styles.checkbox}
              onChange={this.handleCheck}
              size="large"
              error={errors.terms}
              checked={terms}
              name="terms">
              <span>
                I confirm I have read and accept RideTo’s{' '}
                <a className={styles.termsLink} href="/terms" target="_blank">
                  terms & conditions
                </a>{' '}
                and agree to RideTo’s condition of use & sale.
              </span>
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

            <Loading loading={loading}>
              <button
                type="submit"
                className={styles.signup}
                disabled={loading}>
                <span>
                  {hasCheckoutData ? 'Continue to Checkout' : 'Sign Up'}
                </span>
                <img src={ButtonArrowWhite} alt="" />
              </button>
            </Loading>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default SignupPage
