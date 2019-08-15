import React, { useState, useEffect } from 'react'
import Checkbox from 'components/Checkbox'
import styles from './styles.scss'

function MyCheckbox({ handleCompletedClick, id, checked }) {
  const [localChecked, setLocalChecked] = useState(checked)

  const handleCheckboxClick = event => {
    setLocalChecked(event.target.checked)
    handleCompletedClick(id, event.target.checked, true)
  }

  useEffect(() => {
    setLocalChecked(checked)
  }, [checked])

  return (
    <Checkbox
      checked={localChecked}
      key={id}
      extraClass={styles.dashboardCheck}
      size="smallBlack"
      onChange={handleCheckboxClick}>
      <div>I have completed this step</div>
    </Checkbox>
  )
}

export default MyCheckbox
