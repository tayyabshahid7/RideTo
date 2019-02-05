import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import styles from './styles.scss'

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

    if (prevProps.saving && !saving) {
      if (!error) {
        this.setState({
          file: null
        })
        this.input.current.value = ''
        showNotification('Success', 'File uploaded', 'success')
      } else {
        showNotification('Error', error, 'danger')
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
      showNotification('Error', 'File is not CSV', 'danger')
      return
    }
    uploadFile({ schoolId, file })
  }

  render() {
    const { file } = this.state

    return (
      <Row className={styles.container}>
        <Col>
          <h3>Upload Tests</h3>
          <p>Upload full licence tests CSVs</p>
          <form
            className={styles.csvUploadForm}
            onSubmit={this.handleFormSubmit}
            encType="multipart/form-data">
            <Row>
              <Col>
                <div className="form-group">
                  <input
                    name="csvFile"
                    ref={this.input}
                    type="file"
                    accept="text/csv"
                    onChange={this.handleChange}
                  />
                </div>
              </Col>
            </Row>
            <Button color="primary" type="submit" disabled={!file}>
              Submit
            </Button>
          </form>
        </Col>
      </Row>
    )
  }
}

export default CsvUpload
