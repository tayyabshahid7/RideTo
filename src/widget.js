import React from 'react'
import ReactDOM from 'react-dom'

import Widget from 'pages/Widget'
import { setVersionInfo } from 'services/version'

setVersionInfo()

ReactDOM.render(<Widget />, document.getElementById('widget-root'))
