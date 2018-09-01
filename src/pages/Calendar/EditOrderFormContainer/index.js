import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSchoolOrder, updateOrder } from 'store/course'
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

  async handleEditOrder(order) {
    const {
      courseId,
      courseSpaces,
      updateOrder,
      schoolId,
      friendlyId
    } = this.props
    order.user_name = `${order.user_first_name} ${order.user_last_name}`
    order.status = order.payment_status
    order.school_course_id = courseId
    let response = await updateOrder({ schoolId, friendlyId, order })
    this.props.updateCourse({
      schoolId,
      courseId: courseId,
      data: { spaces: courseSpaces }
    })
    return response
  }

  render() {
    const { order, info, loading, onCancel } = this.props

    return (
      <Loading loading={loading}>
        {!loading && (
          <EditOrderForm
            onSave={this.handleEditOrder}
            onCancel={onCancel}
            order={order}
            info={info}
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
    courseId: state.course.single.course.id,
    courseSpaces: state.course.single.course.spaces,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchoolOrder,
      updateOrder
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrderFormContainer)
