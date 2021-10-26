import React, { useEffect, useState, memo } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import get from 'lodash/get'
import { get as callApi } from 'services/api'
import { useMediaQuery } from 'react-responsive'
import expandSvg from 'assets/images/rideto/Expand.svg'
import closeSvg from 'assets/images/rideto/CloseDark.svg'
import SomethingElse from './SomethingElse'
import FeaturedArticles from './FeaturedArticles'
import EmailIconGreen from 'assets/images/rideto/EmailGreen.svg'
import ChatIconWhite from 'assets/images/rideto/ChatWhite.svg'
import ContactV2 from '../ContactV2'

export const fetchFaqs = async () => {
  const path = `faq`
  const response = await callApi(path, {}, false)
  return response
}

function FaqsNewContainer() {
  const [selected, setSelected] = useState('')
  const [response, setResponse] = useState(null)
  const [openCategories, setOpenCategories] = useState([])
  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const [contactModal, setContactModal] = useState(false)

  const handleClickQuestion = idx => {
    const index = openCategories.indexOf(idx)

    if (index > -1) {
      setOpenCategories([])
      return
    }

    setOpenCategories([idx])
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

  const openContact = () => {
    setContactModal(true)
  }

  const [selectedDesktop, setSelectedDesktop] = useState('')
  const [selectedDesktopItem, setSelectedDesktopItem] = useState(0)

  const handleClickDesktop = (item, idx, title) => {
    setSelectedDesktop(item)
    setSelectedDesktopItem(idx)
  }

  const categories = get(response, 'results', [])
  let questions = categories.filter(item => item.name === selected)

  useEffect(() => {
    // Add is_popular questions to popular category
    categories.forEach(item => {
      item.category.forEach(ques => {
        if (ques.is_popular) categories[0].category.push(ques)
      })
    })
  }, [categories])

  const hasQuetion = get(questions, '[0].category', '')
  if (hasQuetion)
    questions[0].category = questions[0].category.filter(ques => ques.is_active)

  useEffect(() => {
    setOpenCategories([])
  }, [selected])

  useEffect(() => {
    const categories = get(response, 'results', [])
    const questions = categories.filter(item => item.name === selected)
    const item = get(questions, '[0].category[0]', '')

    setSelectedDesktop(item)
  }, [selected])

  if (response === null) {
    return null
  }

  const renderQuestionLayout = () => {
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
                    <span>
                      {isSelected ? (
                        <img width="15px" alt="icon" src={closeSvg} />
                      ) : (
                        <img alt="icon" src={expandSvg} />
                      )}
                    </span>
                  </div>

                  {isSelected && (
                    <div className={styles.answerItem}>
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                      {/* Add buttons */}
                      {item.button_tittle && (
                        <button className={styles.submitButton2}>
                          <span className={classnames(styles.submitButtonText)}>
                            <a href={item.button_url}>{item.button_tittle}</a>
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </>
      )

    return (
      <div className={styles.desktopPane}>
        <div className={styles.desktopFlex}>
          <div className={styles.leftPane}>
            <div className={styles.desktopHeading}>
              <h1 className={styles.subHeading}> {selected} </h1>
            </div>
            {questions[0] &&
              questions[0].category &&
              questions[0].category.map((item, idx) => {
                const isSelected = selectedDesktopItem === idx
                const classNames = isSelected
                  ? classnames(
                      styles.questionCardDesktop,
                      styles.isSelectedDesktop
                    )
                  : classnames(styles.questionCardDesktop)

                return (
                  <div
                    key={idx}
                    onClick={() => handleClickDesktop(item, idx)}
                    className={styles.questionItemContainer}>
                    <div className={classNames}>{item.title}</div>
                  </div>
                )
              })}
          </div>

          <div className={styles.rightPane}>
            <h2 className={styles.desktopHeadingAnswer}>
              {selectedDesktop.title}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: selectedDesktop.content }}
            />
            {selectedDesktop.button_tittle && (
              <button className={styles.submitButton2}>
                <a href={selectedDesktop.button_url}>
                  <span className={classnames(styles.submitButtonText)}>
                    {selectedDesktop.button_tittle}
                  </span>
                </a>
              </button>
            )}
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

      {selected !== 'Something Else' && renderQuestionLayout()}
      {selected === 'Something Else' && (
        <SomethingElse openContact={openContact} />
      )}

      <FeaturedArticles />

      <div className={styles.needMore}>
        <div>
          <h2>not finding what you’re looking for?</h2>
          <p>Start a live chat or email us.</p>

          <div className={styles.buttonContainer}>
            <button type="submit" className={classnames(styles.submitButton)}>
              <img width="20px" src={ChatIconWhite} alt="Go" />

              <span className={classnames(styles.submitButtonText)}>
                Live Chat
              </span>
            </button>

            <button
              onClick={openContact}
              type="submit"
              className={classnames(styles.submitButton, styles.hollow)}>
              <img width="20px" src={EmailIconGreen} alt="Go" />

              <span
                className={classnames(
                  styles.submitButtonText,
                  styles.hollowText
                )}>
                Email Us
              </span>
            </button>
          </div>
        </div>
      </div>

      {contactModal && (
        <div className={styles.contactModal}>
          <ContactV2 onClose={() => setContactModal(false)} />
        </div>
      )}
    </div>
  )
}

export default memo(FaqsNewContainer)
