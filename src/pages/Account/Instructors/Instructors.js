import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  ConnectInput,
  ConnectReactSelect,
  Button
} from 'components/ConnectForm'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from './styles.scss'
import classnames from 'classnames'
import { actions as notifyActions } from 'store/notification'

class Instructors extends React.Component {
  constructor(props) {
    super(props)
    this.photoInput = React.createRef()

    this.state = {
      addNew: false,
      selectedInstructor: null,
      photo: '',
      photoPreview: ''
    }
  }

  validateDetail = () => {
    const { showNotification } = this.props
    const { selectedInstructor: staff } = this.state

    if (!staff.first_name) {
      showNotification('Error', 'Please input first name', 'danger')
      return false
    }

    if (!staff.last_name) {
      showNotification('Error', 'Please input last name', 'danger')
      return false
    }

    if (!staff.email) {
      showNotification('Error', 'Please input email', 'danger')
      return false
    }

    if (!staff.password) {
      showNotification('Error', 'Please input password', 'danger')
      return false
    }

    if (!staff.supplier.length) {
      showNotification('Error', 'Please select schools', 'danger')
      return false
    }

    return true
  }

  handleSave = event => {
    event.preventDefault()

    const { newInstructor, editInstructor } = this.props
    const { addNew, selectedInstructor, photo } = this.state

    // validation
    if (addNew && !this.validateDetail()) {
      return
    }

    const formData = new FormData()
    Object.keys(selectedInstructor).forEach(field => {
      if (field === 'supplier') {
        formData.append(field, selectedInstructor.supplier.map(x => x.id))
      } else {
        if (selectedInstructor[field]) {
          formData.append(field, selectedInstructor[field])
        }
      }
    })
    if (photo) {
      formData.append('user_photo', photo)
    }

    if (addNew) {
      newInstructor(formData)
    } else {
      editInstructor(selectedInstructor.id, formData)
    }

    this.setState({ addNew: false, selectedInstructor: null })
  }

  handleEdit = instructor => {
    const { suppliers } = this.props
    const selectedInstructor = {
      ...instructor,
      supplier: suppliers.filter(x => instructor.supplier.includes(x.id))
    }
    this.setState({
      selectedInstructor,
      addNew: false,
      photo: '',
      photoPreview: instructor.user_photo || ''
    })
  }

  handleSupplierChange = values => {
    const { selectedInstructor } = this.state
    this.setState({
      selectedInstructor: { ...selectedInstructor, supplier: values }
    })
  }

  getSupplierNames = ids => {
    return this.props.suppliers.filter(x => ids.includes(x.id)).map(x => x.name)
  }

  handleChange = event => {
    const { name, value } = event.target
    const { selectedInstructor } = this.state
    this.setState({
      selectedInstructor: { ...selectedInstructor, [name]: value }
    })
  }

  handleImageChange = e => {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        photo: file,
        photoPreview: reader.result
      })
    }

    reader.readAsDataURL(file)
  }

  handleAddNew = () => {
    this.setState({
      selectedInstructor: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        supplier: []
      },
      photo: '',
      photoPreview: '',
      addNew: true
    })
  }

  handleDelete = instructor => {
    const confirm = window.confirm(
      `Are you sure you whant to delete instructor ${instructor.first_name} ${instructor.last_name}`
    )
    if (confirm) {
      const { deleteInstructor } = this.props
      deleteInstructor(instructor.id)
    }
  }

  render() {
    const { saving, instructors, suppliers } = this.props
    const { addNew, selectedInstructor, photoPreview } = this.state

    return (
      <Fragment>
        <Fragment>
          <div className={styles.box}>
            <div>
              <h3 className={styles.title}>Add Staff</h3>
              <p>Add a new staff to assign to courses</p>
            </div>
            <div className={styles.buttons}>
              <Button
                id="btnNewInstructor"
                color="primary"
                onClick={this.handleAddNew}>
                Add New
              </Button>
            </div>
          </div>
          <div className={classnames(styles.box, styles.header)}>
            <div className={styles.headerText}>
              <h3 className={styles.title}>Current Staff</h3>
              <p>Edit the details of existing staff user accounts</p>
            </div>
            <div className={styles.userTable}>
              <div className={classnames(styles.userRow, styles.headerRow)}>
                <span>Staff Name</span>
                <span>Schools</span>
                <span>Actions</span>
              </div>
              {instructors.map((instructor, key) => {
                return (
                  <div key={key} className={classnames(styles.userRow)}>
                    <div className={styles.detailPhoto}>
                      {!!instructor.user_photo && (
                        <img src={instructor.user_photo} alt="User" />
                      )}
                    </div>
                    <span className={styles.fullName}>
                      {instructor.first_name} {instructor.last_name}
                    </span>
                    <div className={styles.supplierNames}>
                      {this.getSupplierNames(instructor.supplier).map(name => (
                        <span key={name}>{name}</span>
                      ))}
                    </div>
                    <div>
                      <Button
                        color="link"
                        onClick={() => this.handleEdit(instructor)}>
                        Edit
                      </Button>
                      <Button
                        color="link"
                        onClick={() => this.handleDelete(instructor)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Fragment>

        {selectedInstructor && (
          <Modal isOpen={true}>
            <ModalHeader>
              <h3 className={styles.title}>
                {addNew ? 'Add' : 'Edit'} Staff Details
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className={styles.modalContent}>
                <form
                  id="instructorForm"
                  onSubmit={this.handleSave}
                  className={styles.editForm}>
                  <ConnectInput
                    name="first_name"
                    value={selectedInstructor.first_name}
                    label="First Name"
                    className="form-group"
                    onChange={this.handleChange}
                  />
                  <ConnectInput
                    name="last_name"
                    value={selectedInstructor.last_name}
                    label="Last Name"
                    className="form-group"
                    onChange={this.handleChange}
                  />
                  <ConnectInput
                    name="email"
                    value={selectedInstructor.email}
                    label="Email"
                    className="form-group"
                    onChange={this.handleChange}
                  />
                  <ConnectInput
                    name="password"
                    value={selectedInstructor.password}
                    label="Password"
                    className="form-group"
                    onChange={this.handleChange}
                    type="password"
                    minLength="6"
                  />
                  <div className={styles.photoHolder}>
                    <div>
                      <label className={styles.label}>Photo</label>
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          className={styles.photoPreview}
                          alt="preview"
                        />
                      )}
                    </div>
                    <input
                      style={{ display: 'none' }}
                      className={styles.fileInput}
                      type="file"
                      ref={this.photoInput}
                      onChange={this.handleImageChange}
                    />
                    <Button
                      color="link"
                      type="button"
                      onClick={() => this.photoInput.current.click()}>
                      Choose Photo
                    </Button>
                  </div>
                  <ConnectReactSelect
                    label="Schools"
                    name="supplier"
                    value={selectedInstructor.supplier}
                    onChange={this.handleSupplierChange}
                    options={suppliers}
                  />
                  <Button color="primary" type="submit" disabled={saving}>
                    {addNew ? 'Add' : 'Save'}
                  </Button>
                  <Button
                    color="link"
                    type="button"
                    onClick={() => this.setState({ selectedInstructor: null })}>
                    Cancel
                  </Button>
                </form>
              </div>
            </ModalBody>
          </Modal>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Instructors)
