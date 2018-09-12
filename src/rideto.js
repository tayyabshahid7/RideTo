import React from 'react'
import ReactDOM from 'react-dom'

import { setVersionInfo } from 'services/version'

setVersionInfo()

ReactDOM.render(<h1>RideTo.COM</h1>, document.getElementById('rideto-root'))
