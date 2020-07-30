import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import EventForm from './EventForm'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { getSingleEvent, updateEvent, deleteEvent } from 'store/event'
import { unsetSelectedCourse } from 'store/course'
import styles from './styles.scss'
import { DATE_FORMAT } from '../../../common/constants'
import DateHeading from 'components/Calendar/DateHeading'

class EditEventComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteConfirmModal: false
    }
  }

  componentDidMount() {
    const { getSingleEvent, match } = this.props
    getSingleEvent({ eventId: parseInt(match.params.eventId) })
  }

  componentWillUnmount() {
    const { unsetSelectedCourse } = this.props
    unsetSelectedCourse()
  }

  componentDidUpdate(prevProps) {
    const { saving, event, history, error } = this.props

    if (prevProps.event && !event) {
      const date = moment(new Date(prevProps.event.start_time)).format(
        DATE_FORMAT
      )

      history.push(`/calendar/${date}`)
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
    const { updateEvent, match } = this.props
    updateEvent({
      eventId: match.params.eventId,
      data,
      fullUpdate: true
    })
  }

  handleRemove() {
    const { match } = this.props
    this.props.deleteEvent({
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
    const date = event.start_time
    let backLink = `/calendar/${date.substr(0, 10)}`

    return (
      <React.Fragment>
        <div className={styles.wrapper}>
          <DateHeading date={date ? moment(date) : null} backLink={backLink} />
          <EventForm
            {...this.props}
            onSubmit={this.onSave.bind(this)}
            onRemove={this.handleToggleDeleteModal.bind(this)}
          />
        </div>
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
    schools: state.auth.user.suppliers,
    loading: state.event.single.loading,
    event: state.event.single.event,
    events: state.event.day.events,
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
      unsetSelectedCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventComponent)
