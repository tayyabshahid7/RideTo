import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {logout} from 'actions'
import styles from './styles.scss'


class UserMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if(this.node && !this.node.contains(event.target)){
      this.setState({menuOpen:false})
    }
  }


  toggleMenu() {
    this.setState((prevState) => {
      return {menuOpen:!prevState.menuOpen}
    });
  }

  handleLogout(e) {
    if(window.confirm("Are you sure that you whant to logout?")) {
      this.props.logout()
      this.props.history.push("/")
    } else {
      this.toggleMenu()
    }
  }

  render() {
    let {user} = this.props
    return (
      sessionStorage.getItem('token') &&
      <div className={styles.container}>
        <div className={styles.username} onClick={this.toggleMenu}>{user.email}</div>
        {
          this.state.menuOpen &&
          <div ref={node => this.node = node} className={styles.userMenu}>
            <button  onClick={this.handleLogout}>Logout</button>
            <p>Another action</p>
            <p>Another action</p>
            <p>Another action</p>
          </div>
        }
      </div>  
    )
  }

}
export default withRouter(connect(
    state => ({
        user: state.login.session.user,
    }),
    dispatch => ({
      logout: () => dispatch(logout())
    })
  )(UserMenu))
