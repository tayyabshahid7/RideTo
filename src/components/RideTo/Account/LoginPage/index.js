import React from 'react'
import { Link } from 'react-router-dom'

import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Input from 'components/RideTo/Input'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import { requestToken } from 'services/auth'
import styles from './LoginPage.scss'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)

    this.navigation = [
      {
        title: 'Log In To RideTo',
        subtitle: (
          <div className={styles.navigation}>
            If you don’t have an account you can{' '}
            <Link to="/account/signup">sign up</Link>
          </div>
        )
      }
    ]

    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleBack = this.handleBack.bind(this)
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

  async handleSubmit(event) {
    event.preventDefault()
    const { email, password } = this.state

    try {
      await requestToken(email, password)
      const next = JSON.parse(sessionStorage.getItem('login-next'))

      window.location.href = next
    } catch (error) {
      const { response } = error
      if (response.data) {
        this.setState({
          errors: {
            email: 'Unable to log in with provided credentials.'
          }
        })
      }
    }
  }

  render() {
    const { email, password, errors } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavBack={this.handleBack}
        />
        <div className={styles.loginPage}>
          <h2 className={styles.heading}>Log In to RideTo</h2>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <Input
              placeholder="Email"
              name="email"
              value={email}
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
              required
            />
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
            <div className={styles.subtext}>
              <a href="/users/forgot/">Forgot password</a>
            </div>

            <button type="submit" className={styles.login}>
              <span>Next</span>
              <img src={ButtonArrowWhite} alt="" />
            </button>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
