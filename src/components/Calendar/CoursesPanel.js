import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './CoursesPanel.scss'
import classnames from 'classnames'

class CoursesPanel extends Component {
  render() {
    return <div className={styles.container}>Courses Panel</div>
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanel)
