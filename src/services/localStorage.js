export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.log('There was a problem getting the state from local storage')
    return {}
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify({
      ...JSON.parse(localStorage.getItem('state')),
      ...state
    })
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.log('Problem saving state') // Ignore error since we don't want to break the app
  }
}

export const clearState = key => {
  try {
    if (!key) {
      localStorage.removeItem('state')
    } else {
      const oldState = JSON.parse(localStorage.getItem('state'))
      delete oldState[key]
      const serializedState = JSON.stringify(oldState)
      localStorage.setItem('state', serializedState)
    }
  } catch (err) {
    console.log('Problem clearing state')
  }
}
