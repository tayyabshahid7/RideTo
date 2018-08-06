import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSingleCourse, deleteCourse } from 'actions/course'
import OrdersPanel from './OrdersPanel'

class OrdersPanelContainer extends React.Component {
  componentDidMount() {
    this.loadCourse()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.courseId !== this.props.match.params.courseId) {
      this.loadCourse()
    }
  }

  loadCourse() {
    const { getSingleCourse, match, schoolId } = this.props
    const {
      params: { courseId }
    } = match
    getSingleCourse({ schoolId, courseId })
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
    const { course, loading, error } = this.props
    if (!course) {
      return <div>{loading ? 'Loading...' : error ? `${error}` : ''}</div>
    }
    return (
      <OrdersPanel
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
    error: state.course.single.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSingleCourse,
      deleteCourse
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersPanelContainer)
