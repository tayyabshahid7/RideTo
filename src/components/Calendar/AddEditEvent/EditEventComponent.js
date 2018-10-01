import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import EventForm from './EventForm'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {
  getSingleEvent,
  updateEvent,
  deleteEvent,
  fetchPrice
} from 'store/event'
import { unsetSelectedCourse } from 'store/course'
import { loadEventTypes } from 'store/info'
import { DATE_FORMAT } from '../../../common/constants'

class EditEventComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleEvent, schoolId, match } = this.props
    getSingleEvent({ schoolId, eventId: match.params.eventId })
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, event, history, error, schoolId } = this.props

    if (prevProps.event && !event) {
      const date = moment(new Date(prevProps.event.start_time)).format(
        DATE_FORMAT
      )

      history.push(`/calendar/${date}`)
      return
    }

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

  handleRemove() {
    const { schoolId, match } = this.props
    this.props.deleteEvent({
      schoolId,
      eventId: parseInt(match.params.eventId, 10)
    })
  }

  handleToggleDeleteModal() {
    this.setState({
      showDeleteConfirmModal: !this.state.showDeleteConfirmModal
    })
  }

  render() {
    let { loading, event } = this.props
    const { showDeleteConfirmModal } = this.state

    if (loading) {
      return <div>Loading...</div>
    }
    if (!event) {
      return <div>Event Not Found</div>
    }

    return (
      <React.Fragment>
        <EventForm
          {...this.props}
          onSubmit={this.onSave.bind(this)}
          onRemove={this.handleToggleDeleteModal.bind(this)}
        />
        {showDeleteConfirmModal && (
          <ConfirmModal
            onClose={this.handleToggleDeleteModal.bind(this)}
            showModal={true}
            onDelete={this.handleRemove.bind(this)}
            message={`Are you sure to delete the event?`}
          />
        )}
      </React.Fragment>
    )
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
      deleteEvent,
      loadEventTypes,
      fetchPrice,
      unsetSelectedCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventComponent)
