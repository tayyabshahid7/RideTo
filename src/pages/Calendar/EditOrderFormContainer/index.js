import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  getSchoolOrder,
  updateOrder,
  getDayCourses,
  getDayCourseTimes
} from 'store/course'
import * as orderModule from 'store/order'
import EditOrderForm from 'components/EditOrderForm'
import Loading from 'components/Loading'
import { isAdmin } from 'services/auth'

class EditOrderFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleEditOrder = this.handleEditOrder.bind(this)
    this.handleLoadTimes = this.handleLoadTimes.bind(this)
  }

  componentDidMount() {
    const { trainingId, getSchoolOrder } = this.props
    getSchoolOrder(trainingId)
  }

  async handleEditOrder(order, updateDate = false) {
    const {
      courseId,
      courseSpaces,
      updateOrder,
      activeSchools,
      trainingId,
      date
    } = this.props
    if (order.user_first_name && order.user_last_name) {
      order.user_name = `${order.user_first_name} ${order.user_last_name}`
    }
    if (!updateDate) {
      order.school_course = courseId // add in the course id
    }

    if (!order.user_birthdate) {
      delete order['user_birthdate']
    }

    let response = await updateOrder({
      trainingId,
      order: {
        ...order,
        full_edit: updateDate
      }
    })

    await this.props.updateCourse({
      schoolId: order.training_location,
      courseId: courseId,
      data: { spaces: courseSpaces }
    })

    if (updateDate) {
      this.props.getDayCourses({ activeSchools, date })
      this.props.loadCourses(true)
      // update calendar here
    }
    return response
  }

  async handleLoadTimes(date, defaultTime) {
    const { order, course_type, getDayCourseTimes } = this.props

    await getDayCourseTimes(
      {
        schoolId: order.training_location,
        date,
        course_type,
        bike_type: order.bike_hire
      },
      defaultTime
    )
  }

  render() {
    const {
      order,
      info,
      loading,
      onCancel,
      date,
      time,
      courses,
      times,
      sendEmailConfirmation,
      isSending,
      onDelete,
      isAdmin
    } = this.props

    return (
      <Loading loading={loading}>
        {!loading && (
          <EditOrderForm
            onSave={this.handleEditOrder}
            onCancel={onCancel}
            order={order}
            info={info}
            date={date}
            time={time}
            courses={courses}
            times={times}
            loadTimes={this.handleLoadTimes}
            sendEmailConfirmation={sendEmailConfirmation}
            isSending={isSending}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        )}
      </Loading>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    order: state.course.orderEditForm.order,
    loading: state.course.orderEditForm.loading,
    activeSchools: state.auth.activeSchools,
    info: state.info,
    courses: state.course.day.courses,
    times: state.course.times.available,
    isSending: state.order.isSending,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...orderModule.actions,
      getSchoolOrder,
      updateOrder,
      getDayCourses,
      getDayCourseTimes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrderFormContainer)
