import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import EventForm from './EventForm'
import { createEvent } from 'store/event'

class AddEventComponent extends Component {
  componentDidUpdate(prevProps) {
    const { saving, event, error, schoolId } = this.props

    if (schoolId !== prevProps.schoolId) {
      this.moveBackToPage()
      return
    }

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
    const { schoolId, createEvent } = this.props
    createEvent({ schoolId, data: { ...data, supplier: schoolId.toString() } })
  }

  render() {
    let { event, location, ...rest } = this.props
    let parsed = queryString.parse(location.search)
    let date = parsed.date || ''
    return <EventForm {...rest} date={date} onSubmit={this.onSave.bind(this)} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
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
