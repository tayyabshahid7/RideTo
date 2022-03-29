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
  CLOTHES_BOOTS: 'Boots & Clothing'
}
class AddonSelectionGroup extends React.Component {
  render() {
    const {
      addon_group,
      addons,
      isAdded,
      onAdd,
      onRemove,
      onDetails,
      onSizeUpdate
    } = this.props
    const name = addon_group[0]
    const addonsFilteredGroup = addon_group[1]
    return (
      <section className={styles.addonGroupSection}>
        <ul>
          <li>
            <div className={styles.titleContainer}>
              <h2 className={styles.groupTitle}>{GROUPS[name]}</h2>
            </div>
          </li>
          <li>
            <div className={styles.addonItemContainer}>
              <AddonItemSlider
                addons={addonsFilteredGroup}
                allAddons={addons}
                isAdded={isAdded}
                onAdd={onAdd}
                onRemove={onRemove}
                onSizeUpdate={onSizeUpdate}
                onDetails={onDetails}
              />
            </div>
          </li>
        </ul>
      </section>
    )
  }
}

export default AddonSelectionGroup
