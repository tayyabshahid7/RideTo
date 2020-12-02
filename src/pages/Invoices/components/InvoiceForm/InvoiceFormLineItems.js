import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { ConnectInput } from 'components/ConnectForm'

const InvoiceFormLineItems = ({ data }) => {
  const [lineItems, setLineItems] = useState([])
  const [stats, setStats] = useState({
    total: '0.00',
    subtotal: '0.00',
    tax: '0.00'
  })

  useEffect(() => {
    addLine()
  }, [])

  useEffect(() => {
    let subtotal = 0
    let total = 0
    let tax = 0

    lineItems.forEach(x => {
      if (x.price && x.qty) {
        subtotal += x.price * x.qty
        if (x.tax) {
          const value = x.tax.substr(0, x.tax.length - 1)
          if (value && !isNaN(value)) {
            tax += (x.price * x.qty * parseInt(value)) / 100
          }
        }
      }
    })
    total = subtotal + tax
    subtotal = subtotal.toFixed(2)
    tax = tax.toFixed(2)
    total = total.toFixed(2)

    setStats({ total, subtotal, tax })
  }, [lineItems])

  const addLine = () => {
    const item = {
      name: '',
      qty: 1,
      tax: '20%',
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
    event.persist()
    let { name, value } = event.target

    if (name === 'tax') {
      if (value.substr(-1) === '%') {
        value = value.substr(0, value.length - 1)
      }
      console.log(value)
      if (isNaN(value)) {
        return
      }
      value = value + '%'
    }

    const tmp = lineItems.slice()
    lineItems[index][name] = value
    setLineItems(tmp)
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
            type="text"
            onChange={event => handleChange(event, line, index)}
          />
          <ConnectInput
            basic
            size="lg"
            name="price"
            value={line.price}
            type="number"
            prefix="£"
            prefixBig
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
            £{stats.subtotal}
          </label>
        </div>
        <div className={styles.subRow}>
          <label className={styles.label}>Tax</label>
          <label className={classnames(styles.label, styles.value)}>
            £{stats.tax}
          </label>
        </div>
        <div className={styles.subRow}>
          <label className={styles.label}>Total</label>
          <label className={classnames(styles.label, styles.value)}>
            £{stats.total}
          </label>
        </div>
      </div>
    </div>
  )
}

export default InvoiceFormLineItems
