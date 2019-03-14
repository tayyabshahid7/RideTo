import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import styles from './styles.scss'
import classnames from 'classnames'

class Instructors extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addNew: false,
      selectedInstructor: props.selectedInstructor
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleSave(event) {
    const { schoolId, newInstructor, editInstructor } = this.props
    const { addNew, selectedInstructor } = this.state
    event.preventDefault()
    if (addNew) {
      newInstructor(schoolId, selectedInstructor)
    } else {
      editInstructor(schoolId, selectedInstructor)
    }
    this.setState({ addNew: false, selectedInstructor: null })
  }

  handleEdit(selectedInstructor) {
    this.setState({ selectedInstructor, addNew: false })
  }

  handleChange(event) {
    const { name, value } = event.target
    const { selectedInstructor } = this.state
    this.setState({
      selectedInstructor: { ...selectedInstructor, [name]: value }
    })
  }

  handleAddNew() {
    this.setState({
      selectedInstructor: { first_name: '', last_name: '' },
      addNew: true
    })
  }

  handleDelete(instructor) {
    const confirm = window.confirm(
      `Are you sure you whant to delete instructor ${instructor.first_name} ${
        instructor.last_name
      }`
    )
    if (confirm) {
      const { deleteInstructor, schoolId } = this.props
      deleteInstructor(schoolId, instructor.id)
    }
  }

  render() {
    const { saving, instructors } = this.props
    const { addNew, selectedInstructor } = this.state
    return (
      <Row className={styles.container}>
        <Col sm="6">
          <div className={styles.header}>
            <div>
              <h3>Instructors</h3>
              <p>Add and edit instructors.</p>
            </div>
            <Button color="primary" onClick={this.handleAddNew}>
              Add New
            </Button>
          </div>
          <ul className={styles.list}>
            {instructors.map((instructor, key) => {
              return (
                <li
                  key={key}
                  className={classnames(
                    instructor === selectedInstructor && styles.selected
                  )}>
                  <span className={styles.fullName}>
                    {instructor.first_name} {instructor.last_name}
                  </span>
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
                </li>
              )
            })}
          </ul>
        </Col>
        {selectedInstructor && (
          <Col sm="6" className={styles.editInstructor}>
            <h3>{addNew ? 'Add' : 'Edit'} Instructor Details</h3>
            <form onSubmit={this.handleSave} className={styles.editForm}>
              <InputTextGroup
                name="first_name"
                value={selectedInstructor.first_name}
                label="First Name"
                className="form-group"
                onChange={this.handleChange}
                required
              />
              <InputTextGroup
                name="last_name"
                value={selectedInstructor.last_name}
                label="Last Name"
                className="form-group"
                onChange={this.handleChange}
                required
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
          </Col>
        )}
      </Row>
    )
  }
}

export default Instructors
