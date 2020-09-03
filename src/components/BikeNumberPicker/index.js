import React from 'react'
import { ConnectInput } from 'components/ConnectForm'
import styles from './styles.scss'
import classnames from 'classnames'
import isNil from 'lodash/isNil'

function BikeNumberPicker({
  label,
  value,
  id,
  isEditable,
  onClickMinus,
  onClickPlus,
  onChange,
  className
}) {
  return (
    <div className={classnames(className, styles.bikerPicker)}>
      <label>{label}</label>
      <div className={styles.rightSide}>
        <span className={styles.minus} onClick={onClickMinus}>
          <i className="fa fa-angle-down"></i>
        </span>
        <ConnectInput
          basic
          name={id}
          value={!isNil(value) ? value : ''}
          type="number"
          disabled={!isEditable}
          onChange={onChange}
          required
        />
        <span className={styles.plus} onClick={onClickPlus}>
          <i className="fa fa-angle-up"></i>
        </span>
      </div>
    </div>
  )
}

export default BikeNumberPicker
