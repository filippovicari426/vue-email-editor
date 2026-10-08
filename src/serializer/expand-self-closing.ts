const HTML_VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
const RAW_TEXT = new Set(['script', 'style'])
const TAG_NAME = /<([a-zA-Z][\w:-]*)/y

/** The HTML parser cannot self-close unknown elements, so `<mj-divider />` must become `<mj-divider></mj-divider>` before it runs. */
export function expandSelfClosingTags(source: string): string {
  let out = ''
  let i = 0
  while (i < source.length) {
    const lt = source.indexOf('<', i)
    if (lt === -1) return out + source.slice(i)
    out += source.slice(i, lt)

    if (source.startsWith('<!--', lt)) {
      const end = source.indexOf('-->', lt + 4)
      const stop = end === -1 ? source.length : end + 3
      out += source.slice(lt, stop)
      i = stop
      continue
    }

    TAG_NAME.lastIndex = lt
    const match = TAG_NAME.exec(source)
    if (!match) {
      out += '<'
      i = lt + 1
      continue
    }

    let j = TAG_NAME.lastIndex
    let quote = ''
    while (j < source.length && (quote || source[j] !== '>')) {
      if (quote) {
        if (source[j] === quote) quote = ''
      } else if (source[j] === '"' || source[j] === "'") {
        quote = source[j]
      }
      j++
    }
    if (j >= source.length) return out + source.slice(lt)

    const name = match[1].toLowerCase()
    const selfClosed = source[j - 1] === '/' && !HTML_VOID.has(name)
    out += selfClosed
      ? `${source.slice(lt, j - 1).trimEnd()}></${match[1]}>`
      : source.slice(lt, j + 1)
    i = j + 1

    if (!selfClosed && RAW_TEXT.has(name)) {
      const close = source.toLowerCase().indexOf(`</${name}`, i)
      const stop = close === -1 ? source.length : close
      out += source.slice(i, stop)
      i = stop
    }
  }
  return out
}
