import React from 'react'
import styles from './styles.scss'
import Expander from './Expander'
import Select from 'components/RideTo/Select'
import classnames from 'classnames'

function RouteToFreedom() {
  const percentComplete = 35
  const goal = 'Asdf'
  const style = 'Asdf'

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your route to freedom</h1>
      <Expander title="My goal">
        <div className={styles.formGroup}>
          <Select
            value={goal}
            className={classnames(styles.input, styles.inputSelect)}
            label="My Riding Goal">
            <option>Asdf</option>
          </Select>
        </div>
        <div className={styles.formGroup}>
          <Select
            value={style}
            className={classnames(styles.input, styles.inputSelect)}
            label="My Riding Style">
            <option>Asdf</option>
          </Select>
        </div>
      </Expander>
      <Expander
        title={`${percentComplete}% complete`}
        percentComplete={percentComplete}>
        <div>asdf</div>
      </Expander>
    </div>
  )
}

export default RouteToFreedom
