import { describe, it, expect } from 'vitest'
import { expandSelfClosingTags as expand } from '../expand-self-closing'

describe('expandSelfClosingTags', () => {
  it('expands self-closed MJML tags', () => {
    expect(expand('<mj-divider />')).toBe('<mj-divider></mj-divider>')
  })

  it('keeps "/" and spaces inside quoted values', () => {
    const src = '<mj-image src="a/b c.png" style="border: 2px solid #01A8AB" />'
    expect(expand(src)).toBe('<mj-image src="a/b c.png" style="border: 2px solid #01A8AB"></mj-image>')
  })

  it('keeps ">" inside a quoted value', () => {
    expect(expand('<mj-text title="a>b" />')).toBe('<mj-text title="a>b"></mj-text>')
  })

  it('leaves HTML void tags and closing tags alone', () => {
    const src = '<mj-text>a<br />b<img src="x" /></mj-text>'
    expect(expand(src)).toBe(src)
  })

  it('ignores comments and style bodies', () => {
    const src = '<!-- <mj-x /> --><style>a<b /></style>'
    expect(expand(src)).toBe(src)
  })

  it('returns an unterminated tag untouched', () => {
    expect(expand('<mj-text title="a')).toBe('<mj-text title="a')
  })
})
