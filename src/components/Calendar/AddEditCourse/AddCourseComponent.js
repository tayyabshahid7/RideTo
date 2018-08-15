import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import CourseForm from './CourseForm'
import { createCourse } from 'store/course'
import { loadCourseTypes } from 'store/info'

class AddCourseComponent extends Component {
  onSave(data) {
    const { createCourse } = this.props
    createCourse(data)
  }
  render() {
    let { schools, saving, info, loadCourseTypes } = this.props
    return (
      <div className={styles.addCourse}>
        <CourseForm
          schools={schools}
          saving={saving}
          info={info}
          onSubmit={this.onSave.bind(this)}
          loadCourseTypes={loadCourseTypes}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    saving: state.course.single.saving,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCourse,
      loadCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCourseComponent)
