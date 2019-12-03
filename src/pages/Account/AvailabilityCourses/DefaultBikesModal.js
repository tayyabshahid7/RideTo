import React from 'react'
import styles from './BikesModal.scss'
import Modal from 'react-modal'
import { Table } from 'reactstrap'
import BikeNumberPicker from 'components/BikeNumberPicker'
import { Button } from 'components/ConnectForm'

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root')
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0'
  }
}

function DefaultBikesModal({ activeCourse, setActiveCourse, ...rest }) {
  const COURSES = [
    { name: 'Automatic 50cc' },
    { name: 'Automatic 125cc' },
    { name: 'Manual 50cc' },
    { name: 'Manual 125cc' },
    { name: 'Own Bike' }
  ]

  return (
    <Modal
      {...rest}
      style={customStyles}
      ariaHideApp={!process.env.NODE_ENV === 'test'}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Set Course Default Bikes</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.courseName}>
            <b>Course:</b> CBT Training
          </div>
          <div className={styles.courseDetails}>
            <Table borderless size="sm">
              <thead>
                <tr>
                  <th>Bikes</th>
                  <th className="text-center">Available</th>
                  <th className="text-center">Number Available</th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map(({ name }, index) => (
                  <tr key={index}>
                    <td>{name}</td>
                    <td className="text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="text-center">
                      <BikeNumberPicker className={styles.bikePicker} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button small type="submit" color="primary">
            Save
          </Button>
          <Button
            small
            color="white"
            onClick={() => {
              setActiveCourse(null)
            }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DefaultBikesModal
