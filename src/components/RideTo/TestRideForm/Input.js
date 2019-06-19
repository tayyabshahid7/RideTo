import React, { Fragment } from 'react'
import styles from './styles.scss'
import DatePicker from 'react-datepicker'
import classnames from 'classnames'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import moment from 'moment'

function Input({ value, name, onChange, icon, placeholder }) {
  return (
    <div className={styles.formControls}>
      <div className={styles.inputGroup}>
        <label htmlFor={name} key={icon} className={styles.icon}>
          <i className={`fas fa-${icon}`}></i>
        </label>
        {['location', 'email'].includes(name) ? (
          <input
            className={styles.input}
            type={name === 'email' ? 'email' : 'text'}
            required
            onChange={onChange}
            name={name}
            id={name}
            value={value}
            placeholder={placeholder}
          />
        ) : name === 'licence' ? (
          <select
            className={classnames(styles.input, !value && styles.placeholder)}
            required
            onChange={onChange}
            name={name}
            id={name}
            value={value}>
            <option value="" disabled>
              {placeholder}
            </option>
            <option>CBT Certificate</option>
            <option>UK Driving Licence</option>
            <option>UK Provisional Licence</option>
            <option>EU Licence (with UK counterpart licence number)</option>
            <option>None</option>
          </select>
        ) : (
          <Fragment>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .react-datepicker-wrapper {
                    display: flex;
                    flex-grow: 1;
                  }
                  @media (min-width: 801px) {
                    .react-datepicker-wrapper {
                      margin-left: 70px;
                    }
                  }
                  .react-datepicker__input-container { display: flex; flex-grow: 1; }
                `
              }}
            />
            <DatePicker
              className={styles.input}
              required
              name={name}
              id={name}
              placeholderText={placeholder}
              autoComplete="off"
              selected={value && new Date(value)}
              onChange={date => {
                onChange({
                  target: {
                    name: name,
                    value: moment(date).format('YYYY-MM-DD')
                  }
                })
              }}
              dateFormat="dd/MM/yyyy"
              shouldCloseOnSelect
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Input
