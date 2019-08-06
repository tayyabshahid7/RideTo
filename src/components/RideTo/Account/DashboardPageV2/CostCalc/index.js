import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import Input from 'components/RideTo/Input'
import Select from 'components/RideTo/Select'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

function CostCalc() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cost calculator</h2>
      <form>
        <div className={styles.formGroup}>
          <Select
            value={''}
            onChange={event => console.log(event)}
            className={classnames(styles.input, styles.inputSelect)}
            label="Gear">
            <option>Asdf</option>
            <option>Asdf</option>
            <option>Asdf</option>
          </Select>
        </div>

        <div className={styles.formGroup}>
          <Select
            value={''}
            onChange={event => console.log(event)}
            className={classnames(styles.input, styles.inputSelect)}
            label="Bike">
            <option>Asdf</option>
            <option>Asdf</option>
            <option>Asdf</option>
          </Select>
        </div>

        <div className={styles.formGroup}>
          <Input
            name="postcode"
            value={''}
            onChange={event => console.log(event)}
            className={classnames(styles.input)}
            label="Postcode"
          />
        </div>

        <Button type="submit" modern className={styles.submit}>
          <span>Get finance quote</span>
          <img src={ButtonArrowWhite} alt="" />
        </Button>
      </form>
    </div>
  )
}

export default CostCalc
