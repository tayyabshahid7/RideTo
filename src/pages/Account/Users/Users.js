import React, { Fragment } from 'react'
import { ConnectInput, Button } from 'components/ConnectForm'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from './styles.scss'
import classnames from 'classnames'

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addNew: false,
      selectedUser: props.selectedUser
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleSave(event) {
    const { schoolId, newUser, editUser } = this.props
    const { addNew, selectedUser } = this.state
    event.preventDefault()
    if (addNew) {
      newUser(schoolId, selectedUser)
    } else {
      editUser(schoolId, selectedUser)
    }
    this.setState({ addNew: false, selectedUser: null })
  }

  handleEdit(selectedUser) {
    this.setState({ selectedUser, addNew: false })
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target
    const { selectedUser } = this.state
    this.setState({
      selectedUser: {
        ...selectedUser,
        [name]: type === 'checkbox' ? checked : value
      }
    })
  }

  handleAddNew() {
    this.setState({
      selectedUser: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        permission_level: 'USER_STAFF',
        is_activate: true
      },
      addNew: true
    })
  }

  handleDelete(user) {
    const confirm = window.confirm(
      `Are you sure you whant to delete user ${user.first_name} ${user.last_name}`
    )
    if (confirm) {
      const { deleteUser, schoolId } = this.props
      deleteUser(schoolId, user.user)
    }
  }

  render() {
    const { saving, users } = this.props
    const { addNew, selectedUser } = this.state
    return (
      <Fragment>
        <Fragment>
          <div className={styles.box}>
            <div>
              <h3 className={styles.title}>Add user</h3>
              <p>Add a new user account</p>
            </div>
            <div className={styles.buttons}>
              <Button color="primary" onClick={this.handleAddNew}>
                Add New
              </Button>
            </div>
          </div>
          <div className={classnames(styles.box, styles.header)}>
            <div className={styles.headerText}>
              <h3 className={styles.title}>Current users</h3>
              <p>
                Manage existing users. All users have staff permissions by
                default
              </p>
            </div>
            <ul className={styles.list}>
              {users.map((user, key) => {
                return (
                  <li
                    key={key}
                    className={classnames(
                      user === selectedUser && styles.selected
                    )}>
                    <span className={styles.fullName}>
                      {user.first_name} {user.last_name}
                    </span>
                    <Button color="link" onClick={() => this.handleEdit(user)}>
                      Edit
                    </Button>
                    <Button
                      color="link"
                      onClick={() => this.handleDelete(user)}>
                      Delete
                    </Button>
                  </li>
                )
              })}
            </ul>
          </div>
        </Fragment>

        {selectedUser && (
          <Modal isOpen={true}>
            <ModalHeader>
              <span className={styles.title}>
                {addNew ? 'Add' : 'Edit'} User Details
              </span>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={this.handleSave}
                className={styles.editForm}
                autocomplete="off">
                <ConnectInput
                  name="first_name"
                  value={selectedUser.first_name}
                  label="First Name"
                  className="form-group"
                  onChange={this.handleChange}
                  required={addNew}
                />
                <ConnectInput
                  name="last_name"
                  value={selectedUser.last_name}
                  label="Last Name"
                  className="form-group"
                  onChange={this.handleChange}
                  required={addNew}
                />
                <ConnectInput
                  name="email"
                  value={selectedUser.email}
                  label="Email"
                  className="form-group"
                  onChange={this.handleChange}
                  required={addNew}
                />
                <ConnectInput
                  name="password"
                  value={selectedUser.password}
                  label="Password"
                  className="form-group"
                  onChange={this.handleChange}
                  required={addNew}
                  type="password"
                  minLength="6"
                />
                <Button color="primary" type="submit" disabled={saving}>
                  {addNew ? 'Add' : 'Save'}
                </Button>
                <Button
                  color="link"
                  type="button"
                  onClick={() => this.setState({ selectedUser: null })}>
                  Cancel
                </Button>
              </form>
            </ModalBody>
          </Modal>
        )}
      </Fragment>
    )
  }
}

export default Users
