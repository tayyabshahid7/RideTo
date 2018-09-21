import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCourseTypeAddons } from 'services/supplier'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import AddonSelectionItem from 'components/RideTo/AddonSelectionItem'
import styles from './AddonSelection.scss'

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)
    const qs = parseQueryString(window.location.search.slice(1))

    this.state = {
      addons: [],
      postcode: qs.postcode || ''
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: this.state.postcode
      },
      {
        title: 'Course',
        subtitle: 'Choose a Course'
      },
      {
        title: 'Date & Location',
        subtitle: '-'
      },
      {
        title: 'Extras',
        subtitle: 'Choose Extras below',
        active: true
      }
    ]
  }

  async componentDidMount() {
    // TODO need real values
    const result = await fetchCourseTypeAddons(123, 123)

    this.setState({
      addons: result.results
    })
  }

  render() {
    const { addons } = this.state
    console.log(addons)
    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavClick={this.handleNavigation}
        />
        <Container>
          <Row>
            <Col sm="12">
              <h2 className={styles.heading}>Choose Extras</h2>
            </Col>
          </Row>
          <Row>
            {addons.map(addon => (
              <Col sm="4">
                <AddonSelectionItem addon={addon} />
              </Col>
            ))}
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default AddonSelection
