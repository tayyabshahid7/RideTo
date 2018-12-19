import { Component } from 'react'
import { withRouter } from 'react-router'
import $ from 'jquery'

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      $('#navbarCollapse').collapse('hide')
      document.getElementById('body-container').scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
