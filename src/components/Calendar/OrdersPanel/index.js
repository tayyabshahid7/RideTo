import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  getSingleCourse,
  deleteCourse,
  createSchoolOrder,
  updateSchoolOrder,
  updateCourse
} from 'store/course'
import OrdersPanel from './OrdersPanel'

class OrdersPanelContainer extends React.Component {
  componentDidMount() {
    this.loadCourse()
  }

  componentDidUpdate(prevProps) {
    if (this.props.schoolId !== prevProps.schoolId) {
      this.props.history.push(`/calendar/${this.props.course.date}`)
      return
    }
    if (prevProps.match.params.courseId !== this.props.match.params.courseId) {
      this.loadCourse()
    }
  }

  loadCourse() {
    const { getSingleCourse, match, schoolId } = this.props
    const {
      params: { courseId }
    } = match
    getSingleCourse({ schoolId, courseId, reset: true })
  }

  async handleDeleteCourse() {
    try {
      const { deleteCourse, match, schoolId, history, course } = this.props
      let link = `/calendar/${course.date}`
      const {
        params: { courseId }
      } = match
      await deleteCourse({ schoolId, courseId: parseInt(courseId, 10) })
      history.push(link)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { loading, error, course, ...rest } = this.props
    if (!course) {
      return <div>{loading ? 'Loading...' : error ? `${error}` : ''}</div>
    }
    return (
      <OrdersPanel
        {...rest}
        course={course}
        deleteCourse={this.handleDeleteCourse.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    course: state.course.single.course,
    loading: state.course.single.loading,
    saving: state.course.single.saving,
    error: state.course.single.error,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      deleteCourse,
      createSchoolOrder,
      updateSchoolOrder,
      updateCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersPanelContainer)
