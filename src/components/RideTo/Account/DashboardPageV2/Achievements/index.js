import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { ALL_ACHIEVEMENTS } from './constants'
import trophyDone from './trophyDone.svg'
import trophyTodo from './trophyTodo.svg'
import moment from 'moment'

function Achievements({ achivements }) {
  const mergedAchievements = ALL_ACHIEVEMENTS.map(defaultA => {
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
        My achievements ({achievedLength}/{totalLength})
      </h2>
      <ul className={styles.list}>
        {mergedAchievements
          .slice(0, visibleLength)
          .map(({ name, achieved, create_at }, i) => (
            <li key={i}>
              <span>
                <img src={achieved ? trophyDone : trophyTodo} alt="Trophy" />{' '}
                {name}
              </span>
              <span className={styles.timeCompleted}>
                {create_at ? moment(create_at).fromNow() : '–'}
              </span>
            </li>
          ))}
      </ul>
      <button onClick={handleViewAllClick} className={styles.viewAll}>
        View {visibleLength === totalLength ? 'less' : 'all'} achievements
      </button>
    </div>
  )
}

export default Achievements
