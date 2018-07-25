import React, { Component } from "react";
import { connect } from "react-redux";
// import { withRouter } from 'react-router-dom'
import { login } from "../../actions/login";
import styles from "./styles.scss";
import Header from "shared/Header";
import logo from "assets/images/scooter.png";
import { isAuthenticated } from "services/auth";

class Login extends Component {
  constructor(props) {
    super(props);
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.props.history.push("/");
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (
      !this.emailInput.current.value.trim() &&
      !this.passwordInput.current.value.trim()
    ) {
      return;
    }
    // dispatch(login({email:emailInput.current.value, password:passwordInput.current.value}))
    this.props
      .login(this.emailInput.current.value, this.passwordInput.current.value)
      .then(() => {
        this.props.history.push("/");
      });
  }

  render() {
    return (
      <div className={styles.container}>
        <Header dark />
        <div className={styles.main}>
          <div className={styles.image}>
            <img src={logo} alt="RideTo logo" />
          </div>
          <div className={styles.loginFormContainer}>
            <div className={styles.formTitle}>
              <h1>Partner schools dashboard</h1>
            </div>
            <form className={styles.loginForm} onSubmit={this.handleFormSubmit}>
              <input
                type="email"
                autoComplete="email"
                ref={this.emailInput}
                name="email"
              />
              <br />
              <input
                type="password"
                autoComplete="current-password"
                ref={this.passwordInput}
                name="password"
              />
              <br />
              <button type="submit">Login</button>
            </form>
            {this.props.error && (
              <div style={{ color: "red" }}>{this.props.error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    loggedIn: state.login.loggedIn,
    loading: state.login.loading,
    error: state.login.error
  };
};

let mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => dispatch(login(email, password))
  };
};

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
export default Login;
