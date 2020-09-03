import React, { useEffect, useState } from 'react'
import CalendarShiftDays from '../CalendarShiftDays'
import AddShiftComponent from '../StaffShift/AddShiftComponent'
import EditShiftComponent from '../StaffShift/EditShiftComponent'
import classnames from 'classnames'
import styles from './index.scss'
import vhCheck from 'vh-check'
import moment from 'moment'

vhCheck()

function CalendarShiftView({ users, inactiveUsers, ...props }) {
  const [showNewForm, setShowNewForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({})
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }, [])

  const activeUsers = users.filter(
    x => x.id !== -1 && !inactiveUsers.includes(x.id)
  )

  const handleNewDiary = data => {
    const tmp = {
      eventType: data.eventType,
      date: moment(data.day.date).format('YYYY-MM-DD'),
      user: data.user
    }

    setFormData(tmp)
    setShowNewForm(true)
  }

  const handleEditDiary = data => {
    const tmp = {
      date: moment(data.day.date).format('YYYY-MM-DD'),
      diary: data.diary
    }
    setFormData(tmp)
    setShowEditForm(true)
  }

  const handleCloseForm = () => {
    setShowEditForm(false)
    setShowNewForm(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.daysContainer}>
        <CalendarShiftDays
          activeUsers={activeUsers}
          onEdit={handleEditDiary}
          onNew={handleNewDiary}
          {...props}
        />
      </div>
      {(showNewForm || showEditForm) && (
        <div className={styles.backdrop} onClick={handleCloseForm}></div>
      )}
      <div
        className={classnames(
          styles.formWrapper,
          (showNewForm || showEditForm) && styles.showForm
        )}>
        {showNewForm && (
          <AddShiftComponent
            isPopup
            formData={formData}
            onClose={() => setShowNewForm(false)}
          />
        )}
        {showEditForm && (
          <EditShiftComponent
            isPopup
            formData={formData}
            onClose={() => setShowEditForm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default CalendarShiftView
