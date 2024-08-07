import {
  IconArrowRight,
  IconBoots,
  IconHelmet,
  IconJacket,
  IconMask
} from 'assets/icons'
import classnames from 'classnames'
import { Desktop, Mobile } from 'common/breakpoints'
import AddonSelectionGroup from 'components/RideTo/AddonSelectionGroup'
import RideToButton from 'components/RideTo/Button'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import moment from 'moment'
import React from 'react'
import { Button, Col, Container, Row } from 'reactstrap'
import { parseQueryString } from 'services/api'
import { getCourseTitle } from 'services/course'
import { getAddons, getSupplier } from 'services/page'
import styles from './AddonSelection.scss'

const CHECKLIST_ITEMS = [
  {
    icon: <IconMask />,
    title: 'A face\ncovering',
    keywords: ['OTHER']
  },
  {
    icon: <IconBoots />,
    title: 'Sturdy boots',
    keywords: ['CLOTHES_BOOTS']
  },
  {
    icon: <IconHelmet />,
    title: 'Motorcycle\nhelmet',
    keywords: ['HELMET_GLOVES']
  },
  {
    icon: <IconJacket />,
    title: 'A thick jacket',
    keywords: ['CLOTHES_BOOTS']
  }
]

class AddonSelection extends React.Component {
  constructor(props) {
    super(props)

    const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))

    let selectedAddons = []

    if (checkoutData.addons.length > 0) {
      selectedAddons = checkoutData.addons
    }

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

    let addonGroupsObj = {}

    addons.forEach(addon => {
      if (addon.sizes && addon.sizes.length > 0) {
        addon.selectedSize = null
      }
      if (addon.sizes && addon.sizes.length === 1) {
        addon.selectedSize = addon.sizes[0]
      }
      if (!addon.addon_group) {
        addon.addon_group = 'OTHER'
      }
      if (addon.addon_group in addonGroupsObj) {
        addonGroupsObj[addon.addon_group].push(addon)
      } else {
        addonGroupsObj[addon.addon_group] = []
        addonGroupsObj[addon.addon_group].push(addon)
      }
    })
    const addonGroups = Object.keys(addonGroupsObj).map(key => [
      key,
      addonGroupsObj[key]
    ])

    this.state = {
      addons,
      addonGroups: addonGroups.slice(0, 3),
      allGroupsAvailable: addonGroups,
      postcode: qs.postcode || '',
      courseType: qs.courseType || '',
      qs: qs || {},
      selectedAddons,
      detailsAddon: null,
      supplier: null,
      navigation: this.navigation,
      gloves_jacket_included: checkoutData.gloves_jacket_included,
      helmet_hire: checkoutData.helmet_hire,
      showThreeGroupsOnly: true
    }

    this.handleAddAddon = this.handleAddAddon.bind(this)
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleContinue = this.handleContinue.bind(this)
    this.handleSizeUpdate = this.handleSizeUpdate.bind(this)
    this.updateAddonSize = this.updateAddonSize.bind(this)
    this.handleIsAddonSelected = this.isAddonSelected.bind(this)
    this.handleShowMoreGroups = this.handleShowMoreGroups.bind(this)
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
    const result = arr.map(a => {
      if (a.id === addon.id) {
        return {
          ...a,
          selectedSize,
          sizeRequired: false
        }
      }
      return a
    })

    return result
  }

  handleSizeUpdate(addon, selectedSize) {
    const { addons, selectedAddons } = this.state
    this.setState(
      {
        addons: this.updateAddonSize(addons, addon, selectedSize),
        selectedAddons: this.updateAddonSize(
          selectedAddons,
          addon,
          selectedSize
        )
      },
      () => {
        if (!this.isAddonSelected(addon)) {
          this.handleAddAddon({
            ...addon,
            selectedSize,
            sizeRequired: false
          })
        }
      }
    )
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

  handleShowMoreGroups() {
    const { showThreeGroupsOnly, addonGroups, allGroupsAvailable } = this.state
    if (showThreeGroupsOnly) {
      this.setState({ addonGroups: allGroupsAvailable })
    } else {
      this.setState({ addonGroups: addonGroups.slice(0, 3) })
    }

    this.setState({ showThreeGroupsOnly: !showThreeGroupsOnly })
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

    // scroll to addon
    const addonEl = document.getElementById(items[0].addon_group)
    if (!addonEl) {
      return
    }

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
          className={classnames(
            styles.checkListItem,
            !item.keywords.length && styles.providedItem
          )}
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
          {item.keywords.length ? (
            <span className={styles.required}>BRING YOUR OWN</span>
          ) : (
            <span className={styles.provided}>PROVIDED</span>
          )}
        </div>
        {!isLast && <span className={styles.plus}>+</span>}
      </React.Fragment>
    )
  }

  render() {
    // Kill the addons page so no one can land here
    // return null

    const {
      addonGroups,
      addons,
      navigation,
      gloves_jacket_included,
      helmet_hire,
      showThreeGroupsOnly
    } = this.state

    let checklistItems = CHECKLIST_ITEMS.slice()
    if (gloves_jacket_included) {
      checklistItems[3].keywords = []
    }

    if (helmet_hire) {
      checklistItems[2].keywords = []
    }

    const providedList = checklistItems.filter(x => !x.keywords.length)
    checklistItems = checklistItems.filter(x => x.keywords.length)
    checklistItems = [...checklistItems, ...providedList]

    return (
      <React.Fragment>
        <NavigationComponent navigation={navigation} showIcons={false} />
        <Container className={styles.container}>
          <Row>
            <Col md="6">
              <Col className={styles.headingWrapper}>
                <h1 className={styles.heading}>New Rider Essentials</h1>
                <div className={styles.subHeading}>
                  Get riding faster by adding the gear you need, delivered to
                  your door.
                </div>
              </Col>
            </Col>
            <Mobile>
              <Col md="12">
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
            <Desktop>
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
            </Desktop>
          </Row>
          <Desktop>
            <div className={styles.checkListContainer}>
              <h4>ON THE DAY OF TRAINING YOU'LL NEED TO BRING:</h4>
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
          {addonGroups.map((addon_group, i) => (
            <Row md="6" className={styles.addonsGroupContainer} key={i}>
              <AddonSelectionGroup
                addon_group={addon_group}
                addons={addons}
                isAdded={this.handleIsAddonSelected}
                onAdd={this.handleAddAddon}
                onRemove={this.handleRemoveAddon}
                onSizeUpdate={this.handleSizeUpdate}
              />
            </Row>
          ))}
          <div className={styles.checkoutWrapper}>
            {!addonGroups.length > 3 && (
              <RideToButton
                id="addon-show-more-button"
                alt="show-more-button"
                className={styles.showMoreButton}
                onClick={this.handleShowMoreGroups}>
                <span>{showThreeGroupsOnly ? 'Show More' : 'Show Less'} </span>
              </RideToButton>
            )}
          </div>
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
      </React.Fragment>
    )
  }
}

export default AddonSelection
