import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSchoolOrder, updateOrder, getDayCourses } from 'store/course'
import EditOrderForm from 'components/EditOrderForm'
import Loading from 'components/Loading'

class EditOrderFormContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleEditOrder = this.handleEditOrder.bind(this)
  }

  componentDidMount() {
    const { schoolId, friendlyId, getSchoolOrder } = this.props
    getSchoolOrder({ schoolId, friendlyId })
  }

  async handleEditOrder(order, updateDate = false) {
    const {
      courseId,
      courseSpaces,
      updateOrder,
      schoolId,
      friendlyId,
      date
    } = this.props
    if (order.user_first_name && order.user_last_name) {
      order.user_name = `${order.user_first_name} ${order.user_last_name}`
    }
    order.school_course_id = courseId // add in the course id
    let response = await updateOrder({ schoolId, friendlyId, order })
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

  render() {
    const { order, info, loading, onCancel, date, time, courses } = this.props
    const times = courses.map(course => ({
      title: course.time,
      value: course.time
    }))

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
            times={times}
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
    courses: state.course.day.courses
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchoolOrder,
      updateOrder,
      getDayCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrderFormContainer)
