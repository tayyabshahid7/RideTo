import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login } from 'store/auth'
import { isAuthenticated } from 'services/auth'
import { Link } from 'react-router-dom'
import Logo from 'components/common/Logo'
import styles from './styles.scss'
import { Button, ConnectInput } from 'components/ConnectForm'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.props.history.push('/')
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleFormSubmit = e => {
    e.preventDefault()
    const { email, password } = this.state

    if (!email || !password) {
      return
    }

    this.props.login(email, password).then(() => {
      if (isAuthenticated()) {
        this.props.history.push('/')
      } else {
        this.props.history.replace('/login')
      }
    })
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <Logo />
          <Link to="/home" className={styles.signin}>
            <Button type="button" color="white">
              Go Back
            </Button>
          </Link>
        </header>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={this.handleFormSubmit}>
            <h4>Sign In</h4>
            <ConnectInput
              vertical
              basic
              label={'Email Address'}
              name="email"
              type="email"
              onChange={this.handleChange('email')}
              required
            />
            <ConnectInput
              vertical
              basic
              label={'Password'}
              name="password"
              type="password"
              onChange={this.handleChange('password')}
              required
            />
            <Button type="submit" color="primary">
              Sign In
            </Button>
          </form>
          {this.props.error && (
            <div style={{ color: 'red' }}>{this.props.error}</div>
          )}
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
