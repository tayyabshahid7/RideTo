import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'
import styles from './styles.scss'
import classnames from 'classnames'

const SchoolSelect = ({
  selected,
  options,
  onChange,
  labelField = 'name',
  valueField = 'id',
  small
}) => {
  return (
    <div
      className={classnames(styles.container, !small && styles.containerLarge)}>
      <select
        className={classnames(
          styles.select,
          small ? styles.selectSmall : styles.selectLarge
        )}
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
