import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import { Button, ConnectReactSelect } from 'components/ConnectForm'
import styles from './styles.scss'
import {
  fetchOrderCancelSetting,
  updateOrderCancelSetting
} from 'store/settings'

const options = [
  {
    name: 'Yes',
    value: true
  },
  {
    name: 'No',
    value: false
  }
]

function OrderCancellationSetting({
  fetchOrderCancelSetting,
  updateOrderCancelSetting,
  setting
}) {
  const [value, setValue] = React.useState(options[0])

  React.useEffect(() => {
    fetchOrderCancelSetting()
  }, [])

  React.useEffect(() => {
    setValue(options.find(x => x.value === setting.value))
  }, [setting.value])

  const handleSave = () => {
    updateOrderCancelSetting(value.value)
  }

  const handleChange = event => {
    setValue(event)
  }

  return (
    <Loading loading={setting.loading}>
      <div className={styles.defaultDays}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.title}>Cancellations</div>
            <div>
              When cancelling an order from a course, do you want that space to
              be available to book again?
            </div>
          </div>
          <div>
            <div className={styles.select}>
              <ConnectReactSelect
                value={value}
                name="order-cancellation"
                isMulti={false}
                onChange={handleChange}
                valueField="value"
                options={options}
              />
            </div>
          </div>
        </div>
        <div className={styles.bottomRow}>
          <Button
            id="btnSaveDefaultDays"
            color="primary mt-2"
            onClick={handleSave}
            disabled={setting.saving}>
            Save
          </Button>
        </div>
      </div>
    </Loading>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    setting: state.settings.orderCancel
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchOrderCancelSetting,
      updateOrderCancelSetting
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCancellationSetting)
