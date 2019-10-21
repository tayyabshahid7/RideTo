import React, { Component } from 'react'
import styles from './styles.scss'
import { mapLabelColours } from 'services/settings'
import { Button } from 'components/ConnectForm'

class CalendarLabels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      changedColors: {}
    }

    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleSaveColors = this.handleSaveColors.bind(this)
  }

  componentDidMount() {
    const {
      instructors,
      getInstructors,
      schoolId,
      info,
      loadCourseTypes
    } = this.props

    if (!instructors || instructors.length === 0) {
      getInstructors(schoolId)
    }

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

  render() {
    const { info, instructors, settings } = this.props
    const { changedColors } = this.state

    return (
      <div className={styles.colorLabels}>
        <div className={styles.title}>Calendar Labels</div>
        <div>
          <b>Instructors</b>
        </div>
        <ul className={styles.labelList}>
          {instructors.map(({ first_name, last_name, id }) => (
            <li key={id}>
              <span>
                {first_name} {last_name}
              </span>{' '}
              <input type="color" />
            </li>
          ))}
        </ul>
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
        <div className={styles.bottomRow}>
          <Button
            color="primary mt-2"
            disabled={!Object.keys(changedColors).length}
            onClick={this.handleSaveColors}>
            Save
          </Button>
        </div>
      </div>
    )
  }
}

export default CalendarLabels
