import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput, Button } from 'components/ConnectForm'

class AccountPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_password: '',
      old_password: '',
      new_password_copy: '',
      showForm: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { saving, error, showNotification } = this.props
    if (prevProps.saving && !saving) {
      if (!error) {
        this.setState({
          new_password: '',
          old_password: '',
          new_password_copy: ''
        })
        showNotification('Success', 'Password has been updated', 'success')
      } else {
        showNotification('Error', error, 'danger')
      }
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    const { updatePassword, showNotification } = this.props
    const { new_password, old_password, new_password_copy } = this.state
    if (new_password !== new_password_copy) {
      showNotification('Error', 'Password does not match', 'danger')
      return
    }
    updatePassword({ new_password, old_password })
  }

  render() {
    const {
      new_password,
      old_password,
      new_password_copy,
      showForm
    } = this.state
    return (
      <React.Fragment>
        <div className={classnames(styles.box, styles.boxVertical)}>
          <div className={styles.topRow}>
            <div className={styles.leftCol}>
              <h3 className={styles.title}>Admin Settings</h3>
              <p>If you need to change your password you can do so here</p>
            </div>
            <div className={styles.rightCol}>
              <Button
                onClick={() => {
                  this.setState({
                    showForm: !showForm,
                    new_password: '',
                    old_password: '',
                    new_password_copy: ''
                  })
                }}
                color={showForm ? 'white' : 'primary'}>
                {showForm ? 'Cancel' : 'Update Password'}
              </Button>
            </div>
          </div>

          {showForm && (
            <Row className={styles.container}>
              <Col>
                <h3 className={styles.title}>Update Password</h3>
                <form
                  className={styles.passwordResetForm}
                  onSubmit={this.handleFormSubmit}>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="old_password"
                        value={old_password}
                        label="Old Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange.bind(this)}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="new_password"
                        value={new_password}
                        label="New Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange.bind(this)}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ConnectInput
                        name="new_password_copy"
                        value={new_password_copy}
                        label="Confirm Password"
                        className="form-group"
                        type="password"
                        onChange={this.handleChange.bind(this)}
                        required
                      />
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">
                    Save
                  </Button>
                </form>
              </Col>
            </Row>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default AccountPassword
