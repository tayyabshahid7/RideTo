import React, { useState } from 'react'
import parentStyles from '../styles.scss'
import myStyles from './styles.scss'
import PromoCode from './PromoCode'

const styles = {
  ...parentStyles,
  ...myStyles
}

const BLANK_CODE = {
  text: '',
  price: '',
  uses: '',
  expireDate: '',
  active: true
}

function WidgetPromoCodes() {
  const [codes, setCodes] = useState([BLANK_CODE])

  console.log(styles, setCodes)

  return (
    <div>
      {codes.map((code, i) => (
        <PromoCode key={i} code={code} />
      ))}
    </div>
  )
}

export default WidgetPromoCodes
