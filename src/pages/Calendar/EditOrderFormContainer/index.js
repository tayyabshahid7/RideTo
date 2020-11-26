import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateOrder, getDayCourses, getDayCourseTimes } from 'store/course'
import * as orderModule from 'store/order'
import EditOrderForm from 'components/EditOrderForm'
import Loading from 'components/Loading'
import { isAdmin } from 'services/auth'

class EditOrderFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoadTimes = this.handleLoadTimes.bind(this)
  }

  async handleLoadTimes(date, defaultTime) {
    const { order, orderDetail, course_type, getDayCourseTimes } = this.props
    const orderObject = orderDetail || order

    await getDayCourseTimes(
      {
        schoolId: orderObject.training_location,
        date,
        course_type,
        bike_type: orderObject.bike_hire
      },
      defaultTime
    )
  }

  render() {
    const {
      order,
      orderDetail,
      courseDetail,
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
      onSave,
      isAdmin
    } = this.props

    return (
      <Loading loading={loading}>
        {!loading && (
          <EditOrderForm
            onSave={onSave}
            onCancel={onCancel}
            order={orderDetail || order}
            info={info}
            date={date}
            time={time}
            courses={courses}
            courseDetail={courseDetail}
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
