import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'

import Widget from 'pages/Widget'
import { setVersionInfo } from 'services/version'

Sentry.init({
  dsn: 'https://2c78a1545494483fbacfed06f3390a2f@sentry.io/1804953'
})

setVersionInfo()

ReactDOM.render(<Widget />, document.getElementById('widget-root'))
