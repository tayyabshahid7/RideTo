import React from 'react'
import { Button, Row, Col } from 'reactstrap'
import styles from './styles.scss'
// import InputTextGroup2 from 'components/Forms/InputTextGroup2'
import Loading from 'components/Loading'
import { Editor } from 'slate-react'
import { isKeyHotkey } from 'is-hotkey'
import Html from 'slate-html-serializer'

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
    this.state = {
      settings: this.props.settings ? this.props.settings : {},
      value: html.deserialize(this.props.settings.email_text || '<p></p>')
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

  handleSave() {
    const { onSubmit } = this.props
    const { settings, value } = this.state
    settings.email_text = html.serialize(value)
    onSubmit(settings)
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
        active={isActive}
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
        active={isActive}
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
    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <div className={styles.helpText}>
            <p>
              These are the place holders available that will translate directly
              for any details that you need to add to the confirmation emails
            </p>
            <p>
              Notice that they have to match the examples exactly, otherwise the
              email's text will be inconsistent
            </p>
            <ul>
              <li>
                <b>[[rider_name]]</b> - The rider's first name
              </li>
              <li>
                <b>[[selected_training]]</b> - The selected training (CBT
                Training, Renewal, etc)
              </li>
              <li>
                <b>[[training_details]]</b> - Details about the training booked
                Example: <i>CBT Training - Tue Mar 5 2019 - 09:00 AM</i>
              </li>
              <li>
                <b>[[location]]</b> - The location of the training
              </li>
              <li>
                <b>[[bike_hire]]</b> - Type of bike selected for course
                (Automatic, Manual, Own Bike)
              </li>
              <li>
                <b>[[school_name]]</b> - Your training school name
              </li>
              <li>
                <b>[[school_phone]]</b> - Your phone number for customer contact
              </li>
              <li>
                <b>[[price_paid]]</b> - The price paid for the training. (Note:
                this will not be shown if the booking was manually added)
              </li>
              <li>
                <b>[[logo]]</b> - Your logo image. (Limited to a height of
                100px)
              </li>
            </ul>
          </div>
          <Row>
            <Col className="mt-3 text-right">
              <Button type="submit" color="primary" onClick={this.handleSave}>
                Save
              </Button>
            </Col>
          </Row>
          <Col>
            {this.renderMarkButton('bold', 'bold')}
            {this.renderMarkButton('italic', 'italic')}
            {this.renderMarkButton('underline', 'underline')}
            {this.renderBlockButton('heading-one', 'H1', false)}
            {this.renderBlockButton('heading-two', 'H2', false)}
          </Col>
          <Row />
          <Row>
            <Col className={styles.textArea}>
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
            </Col>
          </Row>
        </Loading>
      </div>
    )
  }
}

export default EmailSettingsForm
