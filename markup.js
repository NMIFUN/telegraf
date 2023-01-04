class Markup {
  forceReply (value = true) {
    this.force_reply = value
    return this
  }

  removeKeyboard (value = true) {
    this.remove_keyboard = value
    return this
  }

  selective (value = true) {
    this.selective = value
    return this
  }

  inputFieldPlaceholder (placeholder) {
    this.input_field_placeholder = placeholder
    return this
  }
  
  extra (options) {
    return {
      reply_markup: { ...this },
      ...options
    }
  }

  keyboard (buttons, options) {
    const keyboard = buildKeyboard(buttons, { columns: 1, ...options })
    if (keyboard && keyboard.length > 0) {
      this.keyboard = keyboard
    }
    return this
  }

  resize (value = true) {
    this.resize_keyboard = value
    return this
  }

  oneTime (value = true) {
    this.one_time_keyboard = value
    return this
  }

  inlineKeyboard (buttons, options) {
    const keyboard = buildKeyboard(buttons, { columns: buttons.length, ...options })
    if (keyboard && keyboard.length > 0) {
      this.inline_keyboard = keyboard
    }
    return this
  }

  button (text, hide) {
    return Markup.button(text, hide)
  }

  contactRequestButton (text, hide) {
    return Markup.contactRequestButton(text, hide)
  }

  locationRequestButton (text, hide) {
    return Markup.locationRequestButton(text, hide)
  }

  pollRequestButton (text, type, hide) {
    return Markup.pollRequestButton(text, type, hide)
  }

  urlButton (text, url, hide) {
    return Markup.urlButton(text, url, hide)
  }

  callbackButton (text, data, hide) {
    return Markup.callbackButton(text, data, hide)
  }

  switchToChatButton (text, value, hide) {
    return Markup.switchToChatButton(text, value, hide)
  }

  switchToCurrentChatButton (text, value, hide) {
    return Markup.switchToCurrentChatButton(text, value, hide)
  }

  gameButton (text, hide) {
    return Markup.gameButton(text, hide)
  }

  payButton (text, hide) {
    return Markup.payButton(text, hide)
  }

  loginButton (text, url, opts, hide) {
    return Markup.loginButton(text, url, opts, hide)
  }

  static removeKeyboard (value) {
    return new Markup().removeKeyboard(value)
  }

  static forceReply (value) {
    return new Markup().forceReply(value)
  }

  static keyboard (buttons, options) {
    return new Markup().keyboard(buttons, options)
  }

  static inlineKeyboard (buttons, options) {
    return new Markup().inlineKeyboard(buttons, options)
  }

  static resize (value = true) {
    return new Markup().resize(value)
  }

  static selective (value = true) {
    return new Markup().selective(value)
  }

  static inputFieldPlaceholder (placeholder) {
    return new Markup().inputFieldPlaceholder(placeholder)
  }
  
  static oneTime (value = true) {
    return new Markup().oneTime(value)
  }

  static button (text, hide = false) {
    return { text: text, hide: hide }
  }

  static contactRequestButton (text, hide = false) {
    return { text: text, request_contact: true, hide: hide }
  }

  static locationRequestButton (text, hide = false) {
    return { text: text, request_location: true, hide: hide }
  }

  static pollRequestButton (text, type, hide = false) {
    return { text: text, request_poll: { type }, hide: hide }
  }

  static urlButton (text, url, hide = false) {
    return { text: text, url: url, hide: hide }
  }

  static callbackButton (text, data, hide = false) {
    return { text: text, callback_data: data, hide: hide }
  }

  static switchToChatButton (text, value, hide = false) {
    return { text: text, switch_inline_query: value, hide: hide }
  }

  static switchToCurrentChatButton (text, value, hide = false) {
    return { text: text, switch_inline_query_current_chat: value, hide: hide }
  }

  static gameButton (text, hide = false) {
    return { text: text, callback_game: {}, hide: hide }
  }

  static payButton (text, hide = false) {
    return { text: text, pay: true, hide: hide }
  }

  static loginButton (text, url, opts = {}, hide = false) {
    return {
      text: text,
      login_url: { ...opts, url: url },
      hide: hide
    }
  }

  static formatHTML (text = '', entities = []) {
    if (!text) return text
    else if (!entities?.length) return escape(text)
  
    length = length ?? text.length
  
    const html = []
    let lastOffset = 0
  
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i]
  
      if (entity.offset >= offset + length) break
  
      const relativeOffset = entity.offset - offset
  
      if (relativeOffset > lastOffset) {
        html.push(escape(text.slice(lastOffset, relativeOffset)))
      } else if (relativeOffset < lastOffset) continue
  
      let skipEntity = false
      const length_ = entity.length
      const text_ = unparse(
        text.slice(relativeOffset, relativeOffset + length_),
        entities.slice(i + 1, entities.length),
        entity.offset,
        length_
      )
  
      switch (entity.type) {
        case 'bold':
          html.push(`<b>${text_}</b>`)
          break
        case 'italic':
          html.push(`<i>${text_}</i>`)
          break
        case 'underline':
          html.push(`<u>${text_}</u>`)
          break
        case 'strikethrough':
          html.push(`<s>${text_}</s>`)
          break
        case 'text_link':
          html.push(`<a href="${entity.url}">${text_}</a>`)
          break
        case 'text_mention':
          html.push(`<a href="tg://user?id=${entity.user.id}">${text_}</a>`)
          break
        case 'spoiler':
          html.push(`<span class="tg-spoiler">${text_}</span>`)
          break
        case 'code':
          html.push(`<code>${text_}</code>`)
          break
        case 'pre':
          if (entity.language) {
            html.push(
              `<pre><code class="language-${entity.language}">${text_}</code></pre>`
            )
          } else {
            html.push(`<pre>${text_}</pre>`)
          }
          break
        default:
          skipEntity = true
      }
  
      lastOffset = relativeOffset + (skipEntity ? 0 : length_)
    }
  
    html.push(escape(text.slice(lastOffset, text.length)))
  
    return html.join('')
  }
}

function escape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

function buildKeyboard (buttons, options) {
  const result = []
  if (!Array.isArray(buttons)) {
    return result
  }
  if (buttons.find(Array.isArray)) {
    return buttons.map(row => row.filter((button) => !button.hide))
  }
  const wrapFn = options.wrap
    ? options.wrap
    : (btn, index, currentRow) => currentRow.length >= options.columns
  let currentRow = []
  let index = 0
  for (const btn of buttons.filter((button) => !button.hide)) {
    if (wrapFn(btn, index, currentRow) && currentRow.length > 0) {
      result.push(currentRow)
      currentRow = []
    }
    currentRow.push(btn)
    index++
  }
  if (currentRow.length > 0) {
    result.push(currentRow)
  }
  return result
}

module.exports = Markup
