import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import EventForm from './EventForm'
import { getSingleEvent, updateEvent, fetchPrice } from 'store/event'
import { loadEventTypes } from 'store/info'
import { DATE_FORMAT } from '../../../common/constants'

class EditEventComponent extends Component {
  componentDidMount() {
    const { getSingleEvent, schoolId, match } = this.props
    getSingleEvent({ schoolId, eventId: match.params.eventId })
  }

  componentDidUpdate(prevProps) {
    const { saving, event, history, error, schoolId } = this.props

    if (schoolId !== prevProps.schoolId) {
      if (event) {
        history.push(
          `/calendar/${moment(new Date(event.start_time)).format(DATE_FORMAT)}`
        )
      } else {
        history.push(`/calendar`)
      }
      return
    }

    if (prevProps.saving === true && saving === false) {
      if (event) {
        history.push(
          `/calendar/${moment(new Date(event.start_time)).format(DATE_FORMAT)}`
        )
      } else {
        console.log('Error', error)
      }
    }
  }

  onSave(data) {
    const { schoolId, updateEvent, match } = this.props
    updateEvent({
      schoolId,
      eventId: match.params.eventId,
      data: { ...data, supplier: schoolId.toString() },
      fullUpdate: true
    })
  }

  render() {
    let { loading, event } = this.props

    if (loading) {
      return <div>Loading...</div>
    }
    if (!event) {
      return <div>Event Not Found</div>
    }

    return <EventForm {...this.props} onSubmit={this.onSave.bind(this)} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    loading: state.event.single.loading,
    event: state.event.single.event,
    saving: state.event.single.saving,
    instructors: state.instructor.instructors,
    pricing: state.event.pricing,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleEvent,
      updateEvent,
      loadEventTypes,
      fetchPrice
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventComponent)
