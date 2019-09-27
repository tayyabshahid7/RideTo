import React, { useState } from 'react'
import styles from './styles.scss'
import { ALL_ACHIEVEMENTS } from './constants'
import trophyDone from './trophyDone.svg'
import trophyTodo from './trophyTodo.svg'
import moment from 'moment'

const DEFAULT_LENGTH = 2

function Achievements({ achievements }) {
  const mergedAchievements = ALL_ACHIEVEMENTS.map(defaultA => {
    const userA = achievements.find(({ constant }) => {
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
  const [visibleLength, setVisibleLength] = useState(DEFAULT_LENGTH)

  const handleViewAllClick = () => {
    if (visibleLength === DEFAULT_LENGTH) {
      setVisibleLength(achievedLength)
    }

    if (visibleLength === achievedLength) {
      setVisibleLength(totalLength)
    }
  }

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
      {visibleLength !== totalLength && (
        <button onClick={handleViewAllClick} className={styles.viewAll}>
          {visibleLength === DEFAULT_LENGTH
            ? 'Show more'
            : 'View all achievements'}
        </button>
      )}
    </div>
  )
}

export default Achievements
