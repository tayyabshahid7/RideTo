import React, { memo, useEffect, useState } from 'react'

import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import styles from 'components/RideTo/FaqsNewContainer/SomethingElse/styles.scss'
import styles2 from 'components/RideTo/FaqsNewContainer/styles.scss'

function ButtonContainer({
  openContact,
  button_url,
  button_title,
  contact_button_type
}) {
  // If there is no button, render nothing
  const [isClicked, setIsClicked] = useState(false)
  useEffect(() => {
    if (isClicked) {
      window.location.href = '#hs-chat-close'
      setIsClicked(!isClicked)
    }
  }, [isClicked])

  const onCLickHandler = event => {
    setIsClicked(true)
    window.location.href = '#hs-chat-open'
  }
  if (contact_button_type === 'BUTTON_NONE' || contact_button_type === '') {
    return null
  }

  // If button type is chat button
  const currentTime = new Date().getHours()
  const isChatAvaiable = currentTime <= 17 && currentTime >= 9

  if (contact_button_type === 'BUTTON_LIVE') {
    return (
      <div>
        {isChatAvaiable ? (
          <button
            onClick={onCLickHandler}
            type="submit"
            className={styles.submitButton}>
            <span className={styles.submitButtonText}>Start Chat</span>
            <span>
              <img src={ButtonArrowWhite} alt="Go" />
            </span>
          </button>
        ) : (
          <button type="submit" className={styles.notAvaiableButton}>
            <span>not available</span>
          </button>
        )}
      </div>
    )
  }

  if (contact_button_type === 'BUTTON_CONTACT') {
    return (
      <div>
        <button
          onClick={() => {
            openContact()
          }}
          type="submit"
          className={styles.submitButton}>
          <span className={styles.submitButtonText}>Email Us</span>
          <span>
            <img src={ButtonArrowWhite} alt="Go" />
          </span>
        </button>
      </div>
    )
  }

  if (contact_button_type === 'BUTTON_URL') {
    return (
      <div>
        {button_title && (
          <button className={styles2.submitButton2}>
            <a href={button_url}>
              <span className={styles2.submitButtonText}>{button_title}</span>
            </a>
          </button>
        )}
      </div>
    )
  }

  return <div></div>
}
export default memo(ButtonContainer)
