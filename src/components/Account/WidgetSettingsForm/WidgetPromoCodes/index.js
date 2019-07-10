import React, { useState, useEffect } from 'react'
import parentStyles from '../styles.scss'
import myStyles from './styles.scss'
import PromoCode from './SinglePromoCode.js'
import { Button } from 'components/ConnectForm'
import { uniqueId } from 'utils/helper'
import {
  fetchPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode
} from 'services/promo-codes'
import { connect } from 'react-redux'

const styles = {
  ...parentStyles,
  ...myStyles
}

const BLANK_CODE = {
  id: null,
  code: '',
  discount: '',
  num_of_uses_available: '',
  expire_date: '',
  is_active: true,
  isNew: true
}

function WidgetPromoCodes({ schoolId }) {
  const [codes, setCodes] = useState([])

  useEffect(() => {
    async function fetchCodes() {
      const response = await fetchPromoCodes(schoolId)

      if (response) {
        setCodes(response)
      }
    }

    fetchCodes()
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

  const submitCode = async (event, id) => {
    const code = codes.find(code => code.id === id)

    event.preventDefault()

    if (code.isNew) {
      try {
        const response = await createPromoCode(schoolId, code)

        if (response) {
          setCodes(prevstate =>
            prevstate.map(code => {
              if (code.id !== id) {
                return code
              }

              return {
                ...code,
                id: response.id,
                isNew: false
              }
            })
          )
        }
      } catch (error) {
        alert('Voucher with this code already exists')
      }
    } else {
      updatePromoCode(schoolId, id, code)
    }
  }

  const removeCode = id => {
    if (window.confirm('Are you sure you want to remove this code?')) {
      setCodes(prevstate => prevstate.filter(code => code.id !== id))
      deletePromoCode(schoolId, id)
    }
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
