import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { ALL_ACHIEVMENTS } from './content'

function Achievements({ achivements }) {
  const mergedAchievements = ALL_ACHIEVMENTS.map(defaultA => {
    const userA = achivements.find(({ constant }) => {
      return constant === defaultA.constant
    })

    if (userA) {
      return {
        ...defaultA,
        ...userA,
        achieved: true
      }
    }

    return defaultA
  })

  mergedAchievements.sort(({ achieved: a }, { achieved: b }) => b - a)
  const totalLength = mergedAchievements.length
  const achievedLength = mergedAchievements.filter(a => a.achieved).length
  const [visibleLength, setVisibleLength] = useState(achievedLength)

  const handleViewAllClick = () => {
    setVisibleLength(
      visibleLength === totalLength ? achievedLength : totalLength
    )
  }

  useEffect(() => {
    if (visibleLength !== totalLength) {
      setVisibleLength(achievedLength)
    }
  }, [visibleLength, totalLength, achievedLength])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Your achievments ({achievedLength}/{totalLength})
      </h2>
      <ul className={styles.list}>
        {mergedAchievements.slice(0, visibleLength).map((achivement, i) => (
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
