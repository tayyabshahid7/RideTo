import React, { useEffect, useState, memo } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import get from 'lodash/get'
import { get as callApi } from 'services/api'
import { useMediaQuery } from 'react-responsive'

export const fetchFaqs = async () => {
  const path = 'faq'
  const response = await callApi(path, {}, false)
  return response
}

function FaqsNewContainer() {
  const [selected, setSelected] = useState('')
  const [response, setResponse] = useState(null)
  const [openCategories, setOpenCategories] = useState([])
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const handleClickQuestion = idx => {
    const index = openCategories.indexOf(idx)

    if (index > -1) {
      openCategories.splice(index, 1)
      setOpenCategories([...openCategories])
      return
    }

    setOpenCategories([...openCategories, idx])
  }

  useEffect(() => {
    fetchFaqs().then(res => {
      setResponse(res)
      const defCategory = get(res, 'results[0].name', '')
      setSelected(defCategory)
    })
  }, [])

  const selectedCategory = item => {
    return item === selected ? styles.selectedCard : ''
  }

  const handleClick = item => {
    setSelected(item)
  }

  const [selectedDesktop, setSelectedDesktop] = useState(1)

  const handleClickDesktop = item => {
    setSelectedDesktop(item)
  }

  const categories = get(response, 'results', [])
  const questions = categories.filter(item => item.name === selected)

  useEffect(() => {
    setOpenCategories([])
  }, [selected])

  if (response === null) {
    return null
  }

  const renderQuestionLayout = () => {
    console.log('isMobile', isMobile)
    if (isMobile)
      return (
        <>
          <div className={styles.questionContainer}>
            <h1 className={styles.subHeading}> {selected} </h1>
          </div>
          {questions[0] &&
            questions[0].category &&
            questions[0].category.map((item, idx) => {
              const isSelected = openCategories.includes(idx)
              const parentClass = isSelected
                ? classnames(styles.questionItemContainer, styles.isSelected)
                : classnames(styles.questionItemContainer)

              return (
                <div key={idx} className={parentClass}>
                  <div
                    onClick={() => handleClickQuestion(idx)}
                    className={classnames(
                      styles.questionItem,
                      styles.questionHeading
                    )}>
                    <span>{item.title}</span>
                    <span>+</span>
                  </div>
                  {isSelected && (
                    <div className={styles.answerItem}>
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                  )}
                </div>
              )
            })}
        </>
      )

    return (
      <div className={styles.desktopPane}>
        <div className={styles.desktopHeading}>
          <h1 className={styles.subHeading}> {selected} </h1>
        </div>
        <div className={styles.desktopFlex}>
          <div className={styles.leftPane}>
            {questions[0] &&
              questions[0].category &&
              questions[0].category.map((item, idx) => {
                const isSelected = openCategories.includes(idx)
                const parentClass = isSelected
                  ? classnames(styles.questionItemContainer, styles.isSelected)
                  : classnames(styles.questionItemContainer)

                return (
                  <div
                    key={idx}
                    onClick={() => handleClickDesktop(item.content)}
                    className={parentClass}>
                    <div className={styles.questionCardDesktop}>
                      {item.title}
                    </div>
                  </div>
                )
              })}
          </div>

          <div className={styles.rightPane}>
            <div dangerouslySetInnerHTML={{ __html: selectedDesktop }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.faqsContainer}>
      <h1 className={styles.heading}>How can we help? </h1>

      <div className={styles.categoryContainer}>
        {categories.map((item, idx) => {
          return (
            <div
              key={idx}
              onClick={() => handleClick(item.name)}
              className={classnames(
                styles.cardContainer,
                selectedCategory(item.name)
              )}>
              <img className={styles.categoryImg} src={item.icon} alt="icon" />
              <p className={styles.topCategoryTitle}>{item.name}</p>
            </div>
          )
        })}
      </div>

      {renderQuestionLayout()}
    </div>
  )
}

export default memo(FaqsNewContainer)
