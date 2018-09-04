import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login } from 'store/auth'
import Header from '../../components/Header'
import { isAuthenticated } from 'services/auth'
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
      <div className={styles.container}>
        <Header dark />
        <div className={styles.main}>
          <div className={styles.loginFormContainer}>
            <div className={styles.formTitle}>
              <div>Partner school dashboard</div>
            </div>
            <form className={styles.loginForm} onSubmit={this.handleFormSubmit}>
              <input
                type="email"
                autoComplete="email"
                ref={this.emailInput}
                name="email"
                placeholder="Username"
              />
              <br />
              <input
                type="password"
                autoComplete="current-password"
                ref={this.passwordInput}
                name="password"
                placeholder="Password"
              />
              <br />
              <button type="submit">Login</button>
            </form>
            {this.props.error && (
              <div style={{ color: 'red' }}>{this.props.error}</div>
            )}
          </div>
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
