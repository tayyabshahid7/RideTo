export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.log('There was a problem getting the state from local storage')
    return undefined
  }
}

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (err) {
    console.log('Problem saving state') // Ignore error since we don't want to break the app
  }
}

export const clearState = state => {
  try {
    localStorage.removeItem('state')
  } catch (err) {
    console.log('Problem clearing state')
  }
}
