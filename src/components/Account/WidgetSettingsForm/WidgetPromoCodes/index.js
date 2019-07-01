import React, { useState, useEffect } from 'react'
import parentStyles from '../styles.scss'
import myStyles from './styles.scss'
import PromoCode from './SinglePromoCode.js'
import { Button } from 'components/ConnectForm'
import { uniqueId } from 'utils/helper'
import {
  // fetchPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode
} from 'services/promo-codes'
import { connect } from 'react-redux'

// Just for dev, delete this
const fetchPromoCodes = () => [
  {
    id: 27928374928374,
    text: 'coolcode123',
    price: 50,
    uses: 7,
    expireDate: '2019-07-10',
    isActive: true,
    isNew: false
  }
]

const styles = {
  ...parentStyles,
  ...myStyles
}

const BLANK_CODE = {
  id: null,
  text: '',
  price: '',
  uses: '',
  expireDate: '',
  isActive: true,
  isNew: true
}

function WidgetPromoCodes({ schoolId }) {
  const [codes, setCodes] = useState([])

  useEffect(() => {
    console.log('hello')
    setCodes(fetchPromoCodes(schoolId))
  }, [schoolId])

  const addCode = () => {
    setCodes(prevstate => [
      ...prevstate,
      {
        ...BLANK_CODE,
        id: uniqueId()
      }
    ])
  }

  const updateCode = ({ target }, id) => {
    const { name, type, checked, value: targetValue } = target
    const value = type === 'checkbox' ? checked : targetValue

    setCodes(prevstate =>
      prevstate.map(code => {
        if (code.id !== id) {
          return code
        }

        return {
          ...code,
          [name]: value
        }
      })
    )
  }

  const submitCode = (event, id) => {
    const code = codes.find(code => code.id === id)

    event.preventDefault()

    if (code.isNew) {
      createPromoCode(schoolId, code)
    } else {
      updatePromoCode(schoolId, id, code)
    }
  }

  const removeCode = id => {
    setCodes(prevstate => prevstate.filter(code => code.id !== id))
    deletePromoCode(schoolId, id)
  }

  if (codes.length < 1) {
    return (
      <div>
        <p>No codes yet</p>
        <Button onClick={addCode}>Add new</Button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.promoList}>
        {codes.map(code => (
          <PromoCode
            key={code.id}
            code={code}
            updateCode={updateCode}
            submitCode={submitCode}
            removeCode={removeCode}
          />
        ))}
      </div>
      <Button onClick={addCode}>Add new</Button>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    schoolId: state.auth.schoolId
  }
}

export default connect(mapStateToProps)(WidgetPromoCodes)
