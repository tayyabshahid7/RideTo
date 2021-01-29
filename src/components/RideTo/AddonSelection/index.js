import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import _ from 'lodash'
import { parseQueryString } from 'services/api'
import { getSupplier, getAddons } from 'services/page'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import AddonSelectionItem from 'components/RideTo/AddonSelectionItem'
import styles from './AddonSelection.scss'
import { getCourseTitle } from 'services/course'
import { IconArrowRight } from 'assets/icons'
import { Desktop, Mobile } from 'common/breakpoints'
import { IconHelmet, IconMask, IconJacket, IconBoots } from 'assets/icons'

const CHECKLIST_ITEMS = [
  {
    icon: <IconMask />,
    title: 'A face\ncovering',
    keywords: ['FACE_COVER']
  },
  {
    icon: <IconBoots />,
    title: 'Sturdy boots\nand jeans',
    keywords: ['BOOTS_JEANS']
  },
  {
    icon: <IconHelmet />,
    title: 'Motorcycle\nhelmet',
    keywords: ['HELMET']
  },
  {
    icon: <IconJacket />,
    title: 'A thick jacket \nand motorcycle gloves',
    keywords: ['JACKET_GLOVES']
  }
]

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)

    // Clear addons on landing on page
    const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))
    sessionStorage.setItem(
      'checkout-data',
      JSON.stringify({
        ...checkoutData,
        addons: []
      })
    )

    const qs = parseQueryString(window.location.search.slice(1))

    let step3Params = [`date=${qs.date}`, `bike_hire=${qs.bike_hire}`]
    if (qs.courseId) {
      step3Params.push(`courseId=${qs.courseId}`)
    }
    if (qs.supplierId) {
      step3Params.push(`supplierId=${qs.supplierId}`)
    }

    if (qs.courseType === 'FULL_LICENCE') {
      qs.date = JSON.parse(
        sessionStorage.getItem('trainings')
      )[0].requested_date
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: qs.postcode ? qs.postcode.toUpperCase() : '',
        queryValue: `postcode=${qs.postcode}`,
        last: false
      },
      {
        title: 'Course',
        subtitle: getCourseTitle(qs.courseType),
        queryValue: `courseType=${qs.courseType}`,
        last: false
      },
      {
        title: 'Date',
        subtitle: `${moment(qs.date).format('ddd D, MMMM')}`,
        queryValue: step3Params.join('&'),
        last: false
      },
      {
        title: 'Extras',
        subtitle: 'Choose Extras below',
        active: true,
        last: true
      }
    ]

    let addons = getAddons().filter(
      ({ name }) => name !== 'Peace Of Mind Policy'
    )
    addons.forEach(addon => {
      if (addon.sizes && addon.sizes.length > 0) {
        addon.selectedSize = null
      }
      if (addon.sizes && addon.sizes.length === 1) {
        addon.selectedSize = addon.sizes[0]
      }
    })

    this.state = {
      addons,
      postcode: qs.postcode || '',
      courseType: qs.courseType || '',
      qs: qs || {},
      selectedAddons: [],
      detailsAddon: null,
      supplier: null,
      navigation: this.navigation,
      gloves_jacket_included: checkoutData.gloves_jacket_included,
      helmet_hire: checkoutData.helmet_hire
    }

    this.handleAddAddon = this.handleAddAddon.bind(this)
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleSizeUpdate = this.handleSizeUpdate.bind(this)
    this.updateAddonSize = this.updateAddonSize.bind(this)
  }

  handleAddAddon(addon) {
    const { addons } = this.state

    if (!addon.selectedSize) {
      this.setState({
        addons: addons.map(a =>
          a.id === addon.id ? { ...a, sizeRequired: true } : a
        )
      })
      return
    }

    this.setState({
      addons: addons.map(a =>
        a.id === addon.id ? { ...a, sizeRequired: false } : a
      ),
      selectedAddons: this.state.selectedAddons.concat([addon]),
      detailsAddon: null
    })
  }

  handleRemoveAddon(addon) {
    this.setState({
      selectedAddons: this.state.selectedAddons.filter(
        item => item.id !== addon.id
      ),
      detailsAddon: null
    })
  }

  updateAddonSize(arr, addon, selectedSize) {
    return arr.map(a => {
      if (a.id === addon.id) {
        return {
          ...a,
          selectedSize,
          sizeRequired: false
        }
      }

      return a
    })
  }

  handleSizeUpdate(addon, selectedSize) {
    const { addons, selectedAddons } = this.state

    this.setState({
      addons: this.updateAddonSize(addons, addon, selectedSize),
      selectedAddons: this.updateAddonSize(selectedAddons, addon, selectedSize)
    })
  }

  async handleContinue() {
    const supplier = getSupplier()
    const next = `/${supplier.slug}/checkout`
    const { selectedAddons } = this.state

    const resultsCheckoutData = JSON.parse(
      sessionStorage.getItem('checkout-data')
    )

    // let addons = selectedAddons.map(addon => {
    //   return {
    //     id: addon.id,
    //     selectedSize: addon.selectedSize,
    //     price: addon.discount_price || addon.full_price,
    //     name: addon.name
    //   }
    // })

    let checkoutData = {
      ...resultsCheckoutData,
      addons: selectedAddons
      // addons
    }
    sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData))
    sessionStorage.setItem('login-next', JSON.stringify(next))
    window.location = next
  }

  handleDetails(detailsAddon) {
    this.setState({
      detailsAddon
    })
  }

  handleHighlightAddon(keywords) {
    const { addons } = this.state

    if (!keywords.length) {
      return
    }
    let items = addons.filter(x => x.addon_group === keywords[0])
    if (!items.length) {
      return
    }
    items.forEach(item => (item.price = parseFloat(item.discount_price)))
    items = _.orderBy(items, 'price').reverse()

    // scroll to addon
    const addonEl = document.getElementById('addon-' + items[0].id)
    addonEl.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest'
    })
  }

  isAddonSelected(addon) {
    const { selectedAddons } = this.state

    return selectedAddons.filter(item => item.id === addon.id).length > 0
  }

  renderCheckListItem(item, index, isLast, isMobile = false) {
    return (
      <React.Fragment key={'chk-addon-' + index}>
        <div
          className={styles.checkListItem}
          onClick={() => this.handleHighlightAddon(item.keywords)}>
          {item.icon}
          {isMobile ? (
            <h6>{item.title.split('\n').join(' ')}</h6>
          ) : (
            <h6>
              {item.title.split('\n').map(text => (
                <span key={'chk-text' + text}>{text}</span>
              ))}
            </h6>
          )}
          <span className={styles.required}>REQUIRED</span>
        </div>
        {!isLast && <span className={styles.plus}>+</span>}
      </React.Fragment>
    )
  }

  render() {
    // Kill the addons page so no one can land here
    // return null

    const {
      addons,
      navigation,
      gloves_jacket_included,
      helmet_hire
    } = this.state
    let checklistItems = CHECKLIST_ITEMS.slice()
    if (gloves_jacket_included) {
      checklistItems[3].keywords = []
    }

    if (helmet_hire) {
      checklistItems[2].keywords = []
    }

    checklistItems = checklistItems.filter(x => x.keywords.length)

    return (
      <React.Fragment>
        <NavigationComponent navigation={navigation} showIcons={false} />
        <Container>
          <Row>
            <Col md="6">
              <h1 className={styles.heading}>New Rider Essentials</h1>
              <div className={styles.subHeading}>
                Get on the road faster with the rider gear you need delivered to
                your door. FREE delivery with ALL orders.
              </div>
            </Col>
            <Mobile>
              <Col md="12">
                <div className={styles.checkListContainer}>
                  <h4>ON THE DAY OF TRAINING YOU'LL NEED TO BRING:</h4>
                  <div className={styles.checkLists}>
                    {checklistItems.map((item, index) =>
                      this.renderCheckListItem(
                        item,
                        index,
                        index === checklistItems.length - 1,
                        true
                      )
                    )}
                  </div>
                </div>
              </Col>
            </Mobile>
            <Col md="6" className={styles.skipLink}>
              <Button
                id="addons-checkout-button"
                color="primary"
                className={styles.checkoutButton}
                onClick={this.handleContinue}>
                <span>Continue To Checkout</span>
                <IconArrowRight className={styles.arrowIcon} />
              </Button>
            </Col>
          </Row>
          <Desktop>
            <div className={styles.checkListContainer}>
              <h4>ON THE DAY OF TRAINING YOU'LL NEED TO HAVE:</h4>
              <div className={styles.checkLists}>
                {checklistItems.map((item, index) =>
                  this.renderCheckListItem(
                    item,
                    index,
                    index === checklistItems.length - 1
                  )
                )}
              </div>
            </div>
          </Desktop>
          <Row>
            {addons.map((addon, i) => (
              <Col xs="12" key={i}>
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
          <div className={styles.checkoutWrapper}>
            <Button
              id="addons-checkout-button"
              color="primary"
              className={styles.checkoutButton}
              onClick={this.handleContinue}>
              <span>Continue To Checkout</span>
              <IconArrowRight className={styles.arrowIcon} />
            </Button>
          </div>
        </Container>
        {/*
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
        */}
      </React.Fragment>
    )
  }
}

export default AddonSelection
