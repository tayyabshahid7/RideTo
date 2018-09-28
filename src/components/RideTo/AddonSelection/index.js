import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import moment from 'moment'

import { parseQueryString } from 'services/api'
import { fetchCourseTypeAddons, fetchSingleSupplier } from 'services/supplier'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import AddonSelectionItem from 'components/RideTo/AddonSelectionItem'
import SidePanel from 'components/RideTo/SidePanel'
import AddonDetails from 'components/RideTo/AddonDetails'
import styles from './AddonSelection.scss'
import { getCourseTitle } from 'services/course'
import { IconArrowRight } from 'assets/icons'

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)
    const qs = parseQueryString(window.location.search.slice(1))

    this.state = {
      addons: [],
      postcode: qs.postcode || '',
      courseType: qs.courseType || '',
      qs: qs || {},
      selectedAddons: [],
      detailsAddon: null,
      supplier: null
    }

    let step3Params = [`date=${qs.date}`]
    if (qs.courseId) {
      step3Params.push(`courseId=${qs.courseId}`)
    }
    if (qs.supplierId) {
      step3Params.push(`supplierId=${qs.supplierId}`)
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: this.state.postcode,
        queryValue: `postcode=${this.state.postcode}`
      },
      {
        title: 'Course',
        subtitle: getCourseTitle(this.state.courseType),
        queryValue: `courseType=${this.state.courseType}`
      },
      {
        title: 'Date & Location',
        subtitle: `${moment(qs.date).format('ddd D, MMMM')}`,
        queryValue: step3Params.join('&')
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
    this.handleContinue = this.handleContinue.bind(this)
  }

  loadData() {
    // this.loadSupplier()
    this.loadAddOns()
  }

  async loadSupplier() {
    const { qs } = this.state
    if (qs.supplierId) {
      let response = await fetchSingleSupplier(qs.supplierId, false)
      this.setState({ supplier: response.result })
    }
  }

  async loadAddOns() {
    const { qs } = this.state
    if (qs.supplierId) {
      const result = await fetchCourseTypeAddons(qs.supplierId, qs.courseType)

      this.setState({
        addons: result.results
      })
    }
  }

  async componentDidMount() {
    // TODO need real values
    this.loadData()
  }

  handleAddAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.concat([addon]),
      detailsAddon: null
    })
  }

  handleRemoveAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.filter(a => a !== addon),
      detailsAddon: null
    })
  }

  handleContinue() {
    // Save all data to local storage then redirect to login or account page
    let addOns = this.state.selectedAddons.map(addOn => addOn.id).join(',')
    sessionStorage.setItem('checkout-data-query', window.location.search)
    sessionStorage.setItem('checkout-data-add-ons', addOns)
    window.location = '/account'
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
        <NavigationComponent navigation={this.navigation} />
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
          <Row className={styles.checkoutWrapper}>
            <Col sm="12" className={styles.checkoutContent}>
              <Button
                color="primary"
                className={styles.checkoutButton}
                onClick={this.handleContinue}>
                <span>Continue To Checkout</span>
                <IconArrowRight className={styles.arrowIcon} />
              </Button>
            </Col>
          </Row>
        </Container>
        <SidePanel
          visible={detailsAddon !== null}
          headingImage={detailsImage}
          onDismiss={() => this.handleDetails(null)}>
          {detailsAddon && (
            <AddonDetails
              isAdded={selectedAddons.indexOf(detailsAddon) > -1}
              addon={detailsAddon}
              onAdd={this.handleAddAddon}
              onRemove={this.handleRemoveAddon}
            />
          )}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default AddonSelection
