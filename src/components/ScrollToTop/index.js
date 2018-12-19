import { Component } from 'react'
import { withRouter } from 'react-router'
import $ from 'jquery'

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const bodyContainer = document.getElementById('body-container')
      const navBar = $('#navbarCollapse')

      if (bodyContainer) {
        bodyContainer.scrollTo(0, 0)
      }

      if (navBar) {
        navBar.collapse('hide')
      }
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
