import React from 'react'
import Checkbox from 'components/Checkbox'
import styles from './styles.scss'

function MyCheckbox({ handleCompletedClick, id, checked }) {
  return (
    <Checkbox
      checked={checked}
      key={id}
      extraClass={styles.dashboardCheck}
      size="smallBlack"
      onChange={() => handleCompletedClick(id, !checked)}>
      <div>I have completed this step</div>
    </Checkbox>
  )
}

export default MyCheckbox
