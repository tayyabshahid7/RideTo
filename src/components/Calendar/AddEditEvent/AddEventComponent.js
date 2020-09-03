import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import EventForm from './EventForm'
import { createEvent } from 'store/event'
import styles from './styles.scss'
import DateHeading from 'components/Calendar/DateHeading'
import moment from 'moment'

class AddEventComponent extends Component {
  componentDidUpdate(prevProps) {
    const { saving, event, error } = this.props

    if (prevProps.saving === true && saving === false) {
      if (event) {
        this.moveBackToPage()
      } else {
        console.log('Error', error)
      }
    }
  }

  moveBackToPage() {
    const { history, location } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date
    if (date) {
      history.push(`/calendar/${date}`)
    } else {
      history.push(`/calendar`)
    }
  }

  onSave(data) {
    const { createEvent } = this.props
    createEvent({ schoolId: data.supplier, data })
  }

  render() {
    let { event, location, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''
    let backLink = date === '' ? '/calendar' : `/calendar/${date}`

    return (
      <div className={styles.addCourse}>
        <DateHeading date={date ? moment(date) : null} backLink={backLink} />
        <div className={styles.wrapper}>
          <EventForm {...rest} date={date} onSubmit={this.onSave.bind(this)} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    saving: state.event.single.saving,
    event: state.event.single.event,
    error: state.event.single.error,
    pricing: state.event.pricing,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createEvent
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEventComponent)
