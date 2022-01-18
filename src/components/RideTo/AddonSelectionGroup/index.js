import AddonItemSlider from './AddonItemSlider'
import React from 'react'
import styles from './AddonSelectionGroup.scss'

const GROUPS = {
  OTHER: 'Other',
  JACKET_GLOVES: 'Jacket & Gloves',
  FACE_COVER: 'Face Covering',
  HELMET: 'Helmet',
  BOOTS_JEANS: 'Boots & Jeans',
  HELMET_GLOVES: 'Helmet & Gloves',
  CLOTHES_BOOTS: 'Clothes & Boots'
}
class AddonSelectionGroup extends React.Component {
  constructor(props) {
    super(props)
    this.handleSelectSize = this.handleSelectSize.bind(this)
  }

  handleSelectSize(selectedSize) {
    const { onSizeUpdate, addon } = this.props
    onSizeUpdate(addon, selectedSize)
  }

  render() {
    const { addon_group, isAdded, onAdd, onRemove, onDetails } = this.props
    const name = addon_group[0]
    const addons = addon_group[1]
    return (
      <section className={styles.addonGroupSection}>
        <ul>
          <li>
            <div className={styles.titleContainer}>
              <h2 className={styles.groupTitle}>{GROUPS[name]}</h2>
            </div>
          </li>
          <li className={styles.addonItemContainer}>
            <AddonItemSlider
              addons={addons}
              onDetails={onDetails}
              isAdded={isAdded}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          </li>
        </ul>
      </section>
    )
  }
}

export default AddonSelectionGroup
