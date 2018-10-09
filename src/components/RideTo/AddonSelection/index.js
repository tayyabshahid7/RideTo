import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import moment from 'moment'

import { parseQueryString } from 'services/api'
import { getSupplier, getAddons } from 'services/page'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import AddonSelectionItem from 'components/RideTo/AddonSelectionItem'
import SidePanel from 'components/RideTo/SidePanel'
import AddonDetails from 'components/RideTo/AddonDetails'
import styles from './AddonSelection.scss'
import { getCourseTitle } from 'services/course'
import { IconArrowRight } from 'assets/icons'
import { verifyToken, getToken } from 'services/auth'

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)
    const qs = parseQueryString(window.location.search.slice(1))

    let step3Params = [`date=${qs.date}`, `bike_hire=${qs.bike_hire}`]
    if (qs.courseId) {
      step3Params.push(`courseId=${qs.courseId}`)
    }
    if (qs.supplierId) {
      step3Params.push(`supplierId=${qs.supplierId}`)
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: qs.postcode ? qs.postcode.toUpperCase() : '',
        queryValue: `postcode=${qs.postcode}`
      },
      {
        title: 'Course',
        subtitle: getCourseTitle(qs.courseType),
        queryValue: `courseType=${qs.courseType}`
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

    let addons = getAddons()
    addons.forEach(addon => {
      if (addon.sizes && addon.sizes.length > 0) {
        addon.selectedSize = addon.sizes.filter(({ quantity }) => quantity)[0]
      }
    })

    this.state = {
      addons: getAddons(),
      postcode: qs.postcode || '',
      courseType: qs.courseType || '',
      qs: qs || {},
      selectedAddons: [],
      detailsAddon: null,
      supplier: null,
      navigation: this.navigation
    }

    this.handleAddAddon = this.handleAddAddon.bind(this)
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleSizeUpdate = this.handleSizeUpdate.bind(this)
  }

  handleAddAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.concat([addon]),
      detailsAddon: null
    })
  }

  handleRemoveAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.filter(item => item !== addon),
      detailsAddon: null
    })
  }

  handleSizeUpdate(addon, selectedSize) {
    addon.selectedSize = selectedSize
    this.setState({ addons: this.state.addons })
  }

  async handleContinue() {
    // TODO we need to go through account flow first...
    const supplier = getSupplier()
    const next = `/${supplier.slug}/checkout`
    const token = getToken()
    const { qs, selectedAddons } = this.state
    let addons = selectedAddons.map(addon => {
      return {
        id: addon.id,
        selectedSize: addon.selectedSize,
        price: addon.discount_price || addon.full_price,
        name: addon.name
      }
    })

    let checkoutData = { ...qs, addons }
    sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData))
    sessionStorage.setItem('login-next', JSON.stringify(next))

    if (token) {
      try {
        await verifyToken(token)
        window.location = next
      } catch (error) {
        console.error(error)
        window.location = `/account?next=${next}`
      }
    } else {
      window.location = `/account?next=${next}`
    }
  }

  handleDetails(detailsAddon) {
    this.setState({
      detailsAddon
    })
  }

  isAddonSelected(addon) {
    const { selectedAddons } = this.state

    return selectedAddons.filter(item => item === addon).length > 0
  }

  render() {
    const { detailsAddon, addons, navigation } = this.state
    const detailsImage = detailsAddon ? detailsAddon.images[0] : null

    return (
      <React.Fragment>
        <NavigationComponent navigation={navigation} />
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
                  isAdded={this.isAddonSelected(addon)}
                  onAdd={this.handleAddAddon}
                  onRemove={this.handleRemoveAddon}
                  onSizeUpdate={this.handleSizeUpdate}
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
              isAdded={this.isAddonSelected(detailsAddon)}
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
