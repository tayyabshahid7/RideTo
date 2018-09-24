import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCourseTypeAddons } from 'services/supplier'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import AddonSelectionItem from 'components/RideTo/AddonSelectionItem'
import SidePanel from 'components/RideTo/SidePanel'
import AddonDetails from 'components/RideTo/AddonDetails'
import styles from './AddonSelection.scss'

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)
    const qs = parseQueryString(window.location.search.slice(1))

    this.state = {
      addons: [],
      postcode: qs.postcode || '',
      selectedAddons: [],
      detailsAddon: null
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

    this.handleAddAddon = this.handleAddAddon.bind(this)
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
  }

  async componentDidMount() {
    // TODO need real values
    const result = await fetchCourseTypeAddons(988, 'LICENCE_CBT')

    this.setState({
      addons: result.results
    })
  }

  handleAddAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.concat([addon])
    })
  }

  handleRemoveAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.filter(a => a !== addon)
    })
  }

  handleDetails(detailsAddon) {
    this.setState({
      detailsAddon
    })
  }

  render() {
    const { detailsAddon, addons, selectedAddons } = this.state
    const detailsImage = detailsAddon ? detailsAddon.images[0] : null

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
                <AddonSelectionItem
                  addon={addon}
                  isAdded={selectedAddons.indexOf(addon) > -1}
                  onAdd={this.handleAddAddon}
                  onRemove={this.handleRemoveAddon}
                  onDetails={this.handleDetails}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <SidePanel
          visible={detailsAddon !== null}
          headingImage={detailsImage}
          onDismiss={() => this.handleDetails(null)}>
          {detailsAddon && <AddonDetails addon={detailsAddon} />}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default AddonSelection
