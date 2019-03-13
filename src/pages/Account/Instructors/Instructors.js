import React from 'react'
import { Row, Col } from 'reactstrap'
import styles from './styles.scss'

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

  handleSave() {
    const { schoolId, newInstructor, editInstructor } = this.props
    const { addNew, selectedInstructor } = this.state
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
        <Col>
          <h2>
            Instructors <button onClick={this.handleAddNew}>Add New</button>
          </h2>
          <ul>
            {instructors.map((instructor, key) => {
              return (
                <li key={key}>
                  {instructor.first_name} {instructor.last_name}
                  <button onClick={() => this.handleEdit(instructor)}>
                    Edit
                  </button>
                  <button onClick={() => this.handleDelete(instructor)}>
                    Delete
                  </button>
                </li>
              )
            })}
            .
          </ul>
        </Col>
        {selectedInstructor && (
          <Col>
            <form>
              <label>First name</label>
              <input
                name="first_name"
                value={selectedInstructor.first_name}
                onChange={this.handleChange}
              />
              <label>Last name</label>
              <input
                name="last_name"
                value={selectedInstructor.last_name}
                onChange={this.handleChange}
              />
              <button type="button" onClick={this.handleSave} disabled={saving}>
                {addNew ? 'Add' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => this.setState({ selectedInstructor: null })}>
                Cancel
              </button>
            </form>
          </Col>
        )}
      </Row>
    )
  }
}

export default Instructors
