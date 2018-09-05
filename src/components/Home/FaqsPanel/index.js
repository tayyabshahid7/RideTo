import React from 'react'
import { Faqs } from 'common/info'
import classnames from 'classnames'
import styles from './styles.scss'

class FaqsPanel extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={classnames(styles.title, 'text-grey')}>FAQs</div>
        {Faqs.map((faq, index) => (
          <div className={styles.questionAnswer} key={index}>
            <div className={classnames(styles.question, 'text-grey')}>
              {faq.question}
            </div>
            <div className={classnames(styles.answer, 'text-primary')}>
              {faq.answer}
            </div>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

export default FaqsPanel
