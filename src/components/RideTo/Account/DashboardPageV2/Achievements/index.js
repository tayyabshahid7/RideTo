import React, { useState } from 'react'
import styles from './styles.scss'

const ACHIVEMENTS = [
  {
    name: 'Asdf 1',
    achieved: true
  },
  {
    name: 'Asdf 2',
    achieved: false
  },
  {
    name: 'Asdf 3',
    achieved: true
  },
  {
    name: 'Asdf4 ',
    achieved: true
  },
  {
    name: 'Asdf5',
    achieved: true
  },
  {
    name: 'Asdf 6',
    achieved: false
  },
  {
    name: 'Asdf 7',
    achieved: false
  },
  {
    name: 'Asdf 8',
    achieved: false
  },
  {
    name: 'Asdf 9',
    achieved: false
  },
  {
    name: 'Asdf 10',
    achieved: false
  }
]

function Achievements() {
  ACHIVEMENTS.sort(({ achieved: a }, { achieved: b }) => b - a)
  const totalLength = ACHIVEMENTS.length
  const achievedLength = ACHIVEMENTS.filter(a => a.achieved).length
  const [visibleLength, setVisibleLength] = useState(achievedLength)

  const handleViewAllClick = () => {
    setVisibleLength(
      visibleLength === totalLength ? achievedLength : totalLength
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Your achivements ({achievedLength}/{totalLength})
      </h2>
      <ul className={styles.list}>
        {ACHIVEMENTS.slice(0, visibleLength).map((achivement, i) => (
          <li key={i}>{achivement.name}</li>
        ))}
      </ul>
      <button onClick={handleViewAllClick} className={styles.viewAll}>
        View {visibleLength === totalLength ? 'less' : 'all'} achievements
      </button>
    </div>
  )
}

export default Achievements
