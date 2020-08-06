import React, { Component } from 'react'
import styles from './styles.scss'
import { Button } from 'components/ConnectForm'

class CalendarLabels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      changedColors: {},
      changedStaffColors: []
    }

    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleSaveColors = this.handleSaveColors.bind(this)

    this.handleStaffColorChange = this.handleStaffColorChange.bind(this)
    this.handleStaffSaveColors = this.handleStaffSaveColors.bind(this)
  }

  componentDidMount() {
    const { schoolId, info, loadCourseTypes } = this.props

    if (!info.courseTypes || info.courseTypes.length === 0) {
      loadCourseTypes({ schoolId: schoolId })
    }
  }

  handleColorChange({ target }) {
    const { value, name } = target

    this.setState({
      changedColors: {
        ...this.state.changedColors,
        [name]: value
      }
    })
  }

  handleSaveColors() {
    const { updateSettings, settings } = this.props
    const { changedColors } = this.state

    updateSettings({ ...settings, ...changedColors })
  }

  handleStaffColorChange(instructor, colour) {
    this.setState({
      changedStaffColors: [
        ...this.state.changedStaffColors.filter(
          ({ id }) => instructor.id !== id
        ),
        {
          ...instructor,
          colour
        }
      ]
    })
  }

  handleStaffSaveColors() {
    const { editInstructor, updateDiaryColor } = this.props
    const { changedStaffColors } = this.state

    changedStaffColors.forEach(instructor => {
      editInstructor(instructor.supplier, instructor)
      updateDiaryColor(instructor)
    })
  }

  render() {
    const { instructors } = this.props
    const { changedColors, changedStaffColors } = this.state

    return (
      <div className={styles.colorLabels}>
        <div className={styles.title}>Calendar Labels</div>
        <div>
          <b>Instructors</b>
        </div>
        <ul className={styles.labelList}>
          {instructors.map(instructor => {
            const { first_name, last_name, id, colour } = instructor

            return (
              <li key={id}>
                <span>
                  {first_name} {last_name}
                </span>{' '}
                <input
                  type="color"
                  defaultValue={colour}
                  onChange={({ target }) => {
                    this.handleStaffColorChange(instructor, target.value)
                  }}
                />
              </li>
            )
          })}
        </ul>
        {/*
        <div>
          <b>Course types</b>
        </div>
        <ul className={styles.labelList}>
          {info.courseTypes.map(({ name, id, slug }) => {
            const { color, settingName } = mapLabelColours(settings, slug)
            return (
              <li key={id}>
                <span>{name}</span>{' '}
                <input
                  type="color"
                  defaultValue={color}
                  name={settingName}
                  onChange={this.handleColorChange}
                />
              </li>
            )
          })}
        </ul>
        */}
        <div className={styles.bottomRow}>
          <Button
            color="primary mt-2"
            disabled={
              !Object.keys(changedColors).length &&
              !Object.keys(changedStaffColors).length
            }
            onClick={() => {
              this.handleSaveColors()
              this.handleStaffSaveColors()
            }}>
            Save
          </Button>
        </div>
      </div>
    )
  }
}

export default CalendarLabels
