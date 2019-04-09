import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login } from 'store/auth'
import { isAuthenticated } from 'services/auth'
import { ConnectLogo, ConnectLogoFull, Info } from 'assets/icons'
import styles from './styles.scss'

class Login extends Component {
  constructor(props) {
    super(props)
    this.emailInput = React.createRef()
    this.passwordInput = React.createRef()
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.props.history.push('/')
    }
  }

  handleFormSubmit(e) {
    e.preventDefault()
    if (
      !this.emailInput.current.value.trim() &&
      !this.passwordInput.current.value.trim()
    ) {
      return
    }
    // dispatch(login({email:emailInput.current.value, password:passwordInput.current.value}))
    this.props
      .login(this.emailInput.current.value, this.passwordInput.current.value)
      .then(() => {
        this.props.history.push('/')
      })
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loginDetails}>
          <div className={styles.loginDetailsInner}>
            <div className={styles.loginHeader}>
              <ConnectLogo className={styles.loginLogo} />
              <h1 className={styles.loginTitle}>Log In</h1>
            </div>
            <form className={styles.form} onSubmit={this.handleFormSubmit}>
              <label className={styles.formGroup}>
                <span className={styles.formLabel}>Email</span>
                <input
                  className={styles.formElement}
                  type="email"
                  autoComplete="email"
                  ref={this.emailInput}
                  name="email"
                />
              </label>
              <label className={styles.formGroup}>
                <span className={styles.formLabel}>Password</span>
                <input
                  className={styles.formElement}
                  type="password"
                  autoComplete="current-password"
                  ref={this.passwordInput}
                  name="password"
                />
              </label>
              <button className={styles.formSubmit} type="submit">
                Login
              </button>
            </form>
            {this.props.error && (
              <div style={{ color: 'red' }}>{this.props.error}</div>
            )}
          </div>
        </div>
        <div className={styles.info}>
          <ConnectLogoFull className={styles.logoFull} />
          <Info className={styles.laptop} />
          <div className={styles.strap}>SPEND MORE TIME RIDING.</div>
        </div>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    loggedIn: state.auth.loggedIn,
    loading: state.auth.loading,
    error: state.auth.error
  }
}

let mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => dispatch(login(email, password))
  }
}

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
export default Login
