import React from 'react'
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai'
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
      {label}
      <div className={styles.rightSide}>
        <button type="button" className={styles.minus} onClick={onClickMinus}>
          <AiOutlineMinusCircle />
        </button>
        <ConnectInput
          basic
          className={styles.inputNumber}
          name={id}
          value={!isNil(value) ? value : ''}
          type="number"
          disabled={!isEditable}
          onChange={onChange}
          required
        />
        <button type="button" className={styles.plus} onClick={onClickPlus}>
          <AiOutlinePlusCircle />
        </button>
      </div>
    </div>
  )
}

export default BikeNumberPicker
