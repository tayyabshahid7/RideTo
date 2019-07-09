import React, { useRef, useState } from 'react'
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share'
import { FacebookIcon, WhatsappIcon, EmailIcon } from 'react-share'
import styles from './styles.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function DashboardReferral() {
  const img =
    'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/rideto-brighton.jpg'
  const url = 'http://bit.ly/30orwL4'
  const whatsappUrl = 'http://bit.ly/30nahtD'
  const facebookUrl = 'http://bit.ly/30lQris'
  const emailUrl = 'http://bit.ly/30pyjV4'
  const size = 38
  const inputEl = useRef(null)
  const [copyText, setCopyText] = useState('Copy')
  let timeout = null

  const selectInput = () => {
    inputEl.current.select()
  }

  const onCopyClick = () => {
    selectInput()
    setCopyText('Copied')

    window.clearTimeout(timeout)
    timeout = setTimeout(() => {
      setCopyText('Copy')
    }, 3000)
  }

  return (
    <div className={styles.container}>
      <img className={styles.banner} src={img} alt="" />
      <div className={styles.body}>
        <h4>Riding is better with friends - GET THEM STARTED!</h4>
        <p>Share your invite link</p>
        <div className={styles.sharers}>
          <div className={styles.inputContainer}>
            <input
              readOnly
              ref={inputEl}
              className={styles.input}
              type="text"
              value={url}
              onFocus={selectInput}
            />
            <CopyToClipboard text={url}>
              <button className={styles.copyButton} onClick={onCopyClick}>
                {copyText}
              </button>
            </CopyToClipboard>
          </div>
          <div className={styles.socialButtons}>
            <FacebookShareButton
              url={facebookUrl}
              className={styles.shareButton}>
              <FacebookIcon size={size} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={whatsappUrl}
              className={styles.shareButton}>
              <WhatsappIcon size={size} round />
            </WhatsappShareButton>
            <EmailShareButton url={emailUrl} className={styles.shareButton}>
              <EmailIcon size={size} round />
            </EmailShareButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardReferral
