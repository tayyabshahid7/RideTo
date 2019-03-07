import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'
import { DownCaret } from 'assets/icons'
import styles from './styles.scss'

const SchoolSelect = ({
  selected,
  options,
  onChange,
  labelField = 'name',
  valueField = 'id'
}) => {
  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        value={selected}
        onChange={e =>
          onChange(
            e.target.value,
            e.target.options[e.target.selectedIndex].innerText
          )
        }>
        {options.map(opt => (
          <option
            key={opt[valueField]}
            disabled={!opt[valueField]}
            value={opt[valueField]}
            name={opt[labelField]}>
            {opt[labelField]}
          </option>
        ))}
      </select>
      <DownCaret className={styles.caret} width="48" height="26" />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    options: state.auth.user.suppliers,
    selected: state.auth.schoolId
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onChange: changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchoolSelect)
