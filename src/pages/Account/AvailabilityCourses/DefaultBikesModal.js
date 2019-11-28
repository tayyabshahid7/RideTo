import React from 'react'
import styles from './BikesModal.scss'
import Modal from 'react-modal'
import { Table } from 'reactstrap'

Modal.setAppElement('#root')

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

function DefaultBikesModal({ activeCourse, ...rest }) {
  const COURSES = [
    { name: 'Automatic 50cc' },
    { name: 'Automatic 125cc' },
    { name: 'Manual 50cc' },
    { name: 'Manual 125cc' },
    { name: 'Own Bike' }
  ]

  return (
    <Modal {...rest} style={customStyles}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Set Course Default Bikes</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.courseName}>
            <b>Course:</b> CBT Training
          </div>
          <div className={styles.courseDetails}>
            <Table borderless responsive size="sm">
              <thead>
                <tr>
                  <th className="align-middle">Bikes</th>
                  <th className="align-middle">Available</th>
                  <th className="align-middle">Number Available</th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map(({ name }) => (
                  <tr>
                    <td>{name}</td>
                    <td className="text-center">
                      <input type="checkbox" />
                    </td>
                    <td>asdf</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DefaultBikesModal
