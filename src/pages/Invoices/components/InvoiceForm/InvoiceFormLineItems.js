import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput } from 'components/ConnectForm'

const InvoiceFormLineItems = ({ data }) => {
  const [lineItems, setLineItems] = useState([])

  useEffect(() => {
    addLine()
  }, [])

  const addLine = () => {
    const item = {
      name: '',
      qty: 1,
      tax: 0,
      price: 0
    }
    const tmp = lineItems.slice()
    tmp.push(item)
    setLineItems(tmp)
  }

  const removeLine = index => {
    const tmp = lineItems.slice()
    tmp.splice(index, 1)
    setLineItems(tmp)
  }

  const handleChange = (event, line, index) => {
    const { name, value } = event
    console.log(name, value, line, index)
  }

  return (
    <div>
      <div className={styles.blockHeader}>Line Items</div>
      <div className={styles.lineRow}>
        <label className={styles.label}>Item</label>
        <label className={styles.label}>Qty</label>
        <label className={styles.label}>Tax</label>
        <label className={styles.label}>Price</label>
      </div>
      {lineItems.map((line, index) => (
        <div className={classnames(styles.lineRow)} key={index}>
          <ConnectInput
            basic
            size="lg"
            name="name"
            value={line.name}
            type="text"
            onChange={event => handleChange(event, line, index)}
          />
          <ConnectInput
            basic
            size="lg"
            name="qty"
            value={line.qty}
            type="number"
            onChange={event => handleChange(event, line, index)}
          />
          <ConnectInput
            basic
            size="lg"
            name="tax"
            value={line.tax}
            type="number"
            onChange={event => handleChange(event, line, index)}
          />
          <ConnectInput
            basic
            size="lg"
            name="price"
            value={line.price}
            type="number"
            prefix="£"
            onChange={event => handleChange(event, line, index)}
          />
          <div className={styles.closeIcon} onClick={() => removeLine(index)} />
        </div>
      ))}
      <label
        onClick={addLine}
        className={classnames(styles.label, styles.link)}>
        Add an Item
      </label>
      <div
        className={styles.divider}
        style={{ marginTop: 16, marginBottom: 20 }}></div>
      <div className={styles.lineSummary}>
        <div className={styles.subRow}>
          <label className={styles.label}>Subtotal</label>
          <label className={classnames(styles.label, styles.value)}>
            £300.00
          </label>
        </div>
        <div className={styles.subRow}>
          <label className={styles.label}>Tax</label>
          <label className={classnames(styles.label, styles.value)}>
            £60.00
          </label>
        </div>
        <div className={styles.subRow}>
          <label className={styles.label}>Total</label>
          <label className={classnames(styles.label, styles.value)}>
            £360.00
          </label>
        </div>
      </div>
    </div>
  )
}

export default InvoiceFormLineItems
