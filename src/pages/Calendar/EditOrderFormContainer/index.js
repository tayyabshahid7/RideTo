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

class EditOrderFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleEditOrder = this.handleEditOrder.bind(this)
    this.handleLoadTimes = this.handleLoadTimes.bind(this)
  }

  componentDidMount() {
    const { schoolId, trainingId, getSchoolOrder } = this.props
    getSchoolOrder({ schoolId, trainingId })
  }

  async handleEditOrder(order, updateDate = false) {
    const {
      courseId,
      courseSpaces,
      updateOrder,
      schoolId,
      trainingId,
      date
    } = this.props
    if (order.user_first_name && order.user_last_name) {
      order.user_name = `${order.user_first_name} ${order.user_last_name}`
    }
    if (!updateDate) {
      order.school_course = courseId // add in the course id
    }

    let response = await updateOrder({ schoolId, trainingId, order })

    await this.props.updateCourse({
      schoolId,
      courseId: courseId,
      data: { spaces: courseSpaces }
    })

    if (updateDate) {
      this.props.getDayCourses({ schoolId, date })
    }
    return response
  }

  async handleLoadTimes(date) {
    const { schoolId, order, course_type, getDayCourseTimes } = this.props

    await getDayCourseTimes({
      schoolId,
      date,
      course_type,
      bike_type: order.bike_hire
    })
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
      isSending
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
            // handleChangeOrderDate={this.handleChangeOrderDate}
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
    schoolId: state.auth.schoolId,
    info: state.info,
    courses: state.course.day.courses,
    times: state.course.times.available,
    isSending: state.order.isSending
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
