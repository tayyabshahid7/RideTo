import React from 'react'
import { Row, Col } from 'reactstrap'
import { Button } from 'components/ConnectForm'
import styles from './styles.scss'
import SchoolSelect from 'components/SchoolSelect'

class CsvUpload extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      file: null
    }

    this.input = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { saving, error, showNotification } = this.props
    console.log(error)
    if (prevProps.saving && !saving) {
      if (!error) {
        this.setState({
          file: null
        })
        this.input.current.value = ''
        showNotification('Success', 'File uploaded', 'success')
      } else {
        showNotification(
          'Error',
          error.message ||
            'There was an error processing the file. Please try again',
          'danger'
        )
      }
    }
  }

  handleChange(event) {
    this.setState({
      file: event.target.files[0]
    })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    const { uploadFile, showNotification, schoolId } = this.props
    const { file } = this.state

    if (file.type !== 'text/csv') {
      showNotification(
        'Error',
        'File is not CSV. Make sure you have the file with ".csv" extension',
        'danger'
      )
      return
    }
    uploadFile({ schoolId, file })
  }

  render() {
    const { file } = this.state

    return (
      <Row className={styles.container}>
        <Col>
          <div className={styles.box}>
            <div>
              <h3 className={styles.title}>Upload DVSA Test Dates</h3>
              <p>
                Upload your test dates to your calendar using the DVSA CSV file
              </p>
              <p>Select the training location to upload your test dates to.</p>
              <div className={styles.select}>
                <SchoolSelect small />
              </div>
            </div>
            <form
              className={styles.csvUploadForm}
              onSubmit={this.handleFormSubmit}
              encType="multipart/form-data">
              <Row>
                <Col>
                  <div>
                    <label className={styles.csvUploadLabel}>
                      <span>{!file ? 'Choose File' : file.name}</span>
                      <input
                        name="csvFile"
                        ref={this.input}
                        type="file"
                        accept="text/csv"
                        onChange={this.handleChange}
                      />
                    </label>
                  </div>
                </Col>
              </Row>
              {file && (
                <div className="mt-3">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              )}
            </form>
          </div>
        </Col>
      </Row>
    )
  }
}

export default CsvUpload
