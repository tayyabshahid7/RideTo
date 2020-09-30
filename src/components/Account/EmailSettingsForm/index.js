import React, { Fragment } from 'react'
import { Row, Col, Modal, ModalBody } from 'reactstrap'
import { Button } from 'components/ConnectForm'
import styles from './styles.scss'
// import InputTextGroup2 from 'components/Forms/InputTextGroup2'
import Loading from 'components/Loading'
import { Editor } from 'slate-react'
import { isKeyHotkey } from 'is-hotkey'
import Html from 'slate-html-serializer'
import classnames from 'classnames'
import { getMediumCourseType } from 'services/course'

const PLACEHOLDERS = [
  '[[rider_name]]',
  '[[selected_training]]',
  '[[training_details]]',
  '[[location]]',
  '[[bike_hire]]',
  '[[school_name]]',
  '[[school_phone]]',
  '[[price_paid]]',
  '[[logo]]'
]

const DEFAULT_NODE = 'paragraph'

var isBoldHotkey = isKeyHotkey('mod+b')
var isItalicHotkey = isKeyHotkey('mod+i')
var isUnderlinedHotkey = isKeyHotkey('mod+u')
var isCodeHotkey = isKeyHotkey('mod+`')

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two'
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline'
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class')
          },
          nodes: next(el.childNodes)
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
          case 'heading-one':
            return <h1>{children}</h1>
          case 'heading-two':
            return <h2>{children}</h2>
          default:
            return
        }
      }
    }
  },
  // Handle marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes)
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          case 'underline':
            return <u>{children}</u>
          default:
            return
        }
      }
    }
  }
]

// Create a new serializer instance with our `rules` from above.
const html = new Html({ rules })

class EmailSettingsForm extends React.Component {
  constructor(props) {
    super(props)

    const courses = this.props.settings.courses.filter(
      course =>
        ![
          'FULL_LICENCE_MOD1_TRAINING',
          'FULL_LICENCE_MOD2_TRAINING',
          'FULL_LICENCE_MOD1_TEST',
          'FULL_LICENCE_MOD2_TEST'
        ].includes(course)
    )

    const emailtexts = courses.reduce((obj, course) => {
      const key = `email_text_${course.toLowerCase()}`

      obj[key] = html.deserialize(this.props.settings[key] || '<p></p>')
      return obj
    }, {})

    this.state = {
      settings: this.props.settings
        ? { ...this.props.settings, ...emailtexts }
        : {},
      // value: html.deserialize(this.props.settings.email_text || '<p></p>'),
      value: html.deserialize('<p></p>'),
      showModal: false,
      courses,
      activeEmail: null
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
    this.renderMark = this.renderMark.bind(this)
    this.renderNode = this.renderNode.bind(this)
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { settings } = this.state
    settings[name] = event.target.value
    this.setState({ settings })
  }

  handleChangeText({ value }) {
    this.setState({ value: value })
  }

  handleCancel(event) {
    event.preventDefault()
    const { handleCancel } = this.props
    handleCancel()
  }

  isValidBrackets(value) {
    const bannedStrings = /\[{3,}|\]{3,}|[^[]\[[^[]|[^\]]\][^\]]|^\[[^[]|[^\]]\]$|\[{2,}[^a-z_]|[^a-z_]\]{2,}/gi

    return !bannedStrings.test(value)
  }

  validateShortCode(value) {
    // const groups = value.match(/\[\[([\w\s]+)\]\]/gi)
    const groups = value.match(/\[\[([^\]]+)\]\]/gi)

    if (groups) {
      for (var code of groups) {
        if (!PLACEHOLDERS.includes(code)) {
          return `${code} is not a valid merge field`
        }
      }
    }

    return false
  }

  handleSave() {
    const { onSubmit } = this.props
    const { settings, value, activeEmail } = this.state
    const serializedValue = html.serialize(value)
    if (!this.isValidBrackets(serializedValue)) {
      alert('Please check [[ ]] brackets are matching')
      return
    }
    const valShortError = this.validateShortCode(serializedValue)
    if (valShortError) {
      alert(valShortError)
      return
    }
    onSubmit({
      ...this.props.settings,
      [activeEmail]: serializedValue
    })
    this.setState({
      showModal: false,
      activeEmail: null,
      settings: {
        ...settings,
        [activeEmail]: value
      }
    })
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type) {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock(type) {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive.toString()}
        onMouseDown={event => this.onClickMark(event, type)}>
        <i className={`fa fa-${icon}`} />
      </Button>
    )
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton(type, icon, showIcon = true) {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive.toString()}
        onMouseDown={event => this.onClickBlock(event, type)}>
        {showIcon ? <i className={`${icon}`} /> : icon}
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode(props, editor, next) {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark(props, editor, next) {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underline':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown(event, editor, next) {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underline'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event, type) {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock(event, type) {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }

  render() {
    let { saving } = this.props
    const { courses } = this.state

    return (
      <Fragment>
        <div className={classnames(styles.box, styles.boxVertical)}>
          <h3 className={styles.title}>Email Templates</h3>
          <p>
            Write the copy that you wish to display in your email communication
            to customers
          </p>
          <Loading loading={saving}>
            {courses.map(course => (
              <div key={course} className={styles.formGroup}>
                <h4
                  className={styles.titleSmall}
                  style={{ textTransform: 'capitalize' }}>
                  {getMediumCourseType({ constant: course })} Booking
                  Confirmation
                </h4>
                <Row>
                  <Col
                    dangerouslySetInnerHTML={{
                      __html: html.serialize(
                        this.state.settings[
                          `email_text_${course.toLowerCase()}`
                        ]
                      )
                    }}
                  />
                  <Col sm="2">
                    <div className={styles.editButton}>
                      <Button
                        style={{ height: 'auto' }}
                        color="link"
                        onClick={() => {
                          this.setState({
                            showModal: !this.state.showModal,
                            activeEmail: `email_text_${course.toLowerCase()}`,
                            value: this.state.settings[
                              `email_text_${course.toLowerCase()}`
                            ]
                          })
                        }}>
                        Edit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </Loading>
        </div>
        <Modal
          isOpen={this.state.showModal}
          className={styles.modalContent}
          fade={false}>
          <Loading loading={saving}>
            <ModalBody>
              <div className={styles.header}>
                Booking Confirmation Email Template
              </div>
              <Row>
                <Col sm="3">
                  <div className={styles.helpText}>
                    <p>
                      Use the place holders to merge a customers booking
                      information directly in the email
                    </p>
                    <p>
                      Place holders must match the examples exactly, including
                      [[ ]]
                    </p>
                    <h4 className={styles.smallTitle}>Merge Place Holders</h4>
                    <ul className={styles.list}>
                      {PLACEHOLDERS.map(placeholder => (
                        <li key={placeholder}>{placeholder}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col sm="9">
                  <div className={styles.buttons}>
                    {this.renderMarkButton('bold', 'bold')}
                    {this.renderMarkButton('italic', 'italic')}
                    {this.renderMarkButton('underline', 'underline')}
                    {this.renderBlockButton('heading-one', 'H1', false)}
                    {this.renderBlockButton('heading-two', 'H2', false)}
                  </div>
                  <div className={styles.textArea}>
                    <Editor
                      spellCheck
                      autoFocus
                      placeholder="Enter some rich text..."
                      ref={editor => {
                        this.editor = editor
                      }}
                      value={this.state.value}
                      onChange={this.handleChangeText}
                      onKeyDown={this.onKeyDown}
                      renderNode={this.renderNode}
                      renderMark={this.renderMark}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="mt-5 text-right">
                  <Button
                    type="submit"
                    color="primary"
                    onClick={this.handleSave}>
                    Save
                  </Button>
                  <Button
                    color="white"
                    onClick={() => {
                      this.setState({
                        showModal: false
                      })
                    }}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Loading>
        </Modal>
      </Fragment>
    )
  }
}

export default EmailSettingsForm
