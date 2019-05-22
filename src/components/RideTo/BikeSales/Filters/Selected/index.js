import React from 'react'

function Selected({ num = 0 }) {
  return <span>{num === 0 ? 'All' : `${num} selected`}</span>
}

export default Selected
