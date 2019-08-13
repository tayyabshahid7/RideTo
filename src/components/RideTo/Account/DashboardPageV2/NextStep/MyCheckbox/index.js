import React from 'react'
import Checkbox from 'components/Checkbox'
import styles from './styles.scss'

function MyCheckbox({ handleCompletedClick, id }) {
  return (
    <Checkbox
      key={id}
      extraClass={styles.dashboardCheck}
      size="smallBlack"
      onChange={() => handleCompletedClick(id)}>
      <div>I have completed this step</div>
    </Checkbox>
  )
}

export default MyCheckbox
