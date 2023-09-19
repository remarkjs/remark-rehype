import assert from 'node:assert/strict'
import test from 'node:test'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMarkdown from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from './index.js'

test('remarkRehype', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'all',
      'default',
      'defaultHandlers',
      'one'
    ])
  })

  await t.test('should mutate', async function () {
    assert.equal(
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync('## Hello, world! ##')
        .toString(),
      '<h2>Hello, world!</h2>'
    )
  })

  await t.test('should mutate with options', async function () {
    assert.equal(
      unified()
        .use(remarkParse)
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypeStringify, {allowDangerousHtml: true})
        .processSync('## Hello, <i>world</i>! ##')
        .toString(),
      '<h2>Hello, <i>world</i>!</h2>'
    )
  })

  await t.test(
    'should mutate with `processor: null` and options',
    async function () {
      assert.equal(
        unified()
          .use(remarkParse)
          .use(remarkRehype, null, {allowDangerousHtml: true})
          .use(rehypeStringify, {allowDangerousHtml: true})
          .processSync('## Hello, <i>world</i>! ##')
          .toString(),
        '<h2>Hello, <i>world</i>!</h2>'
      )
    }
  )

  await t.test('should bridge', async function () {
    assert.equal(
      unified()
        .use(remarkParse)
        .use(remarkRehype, unified())
        .use(remarkMarkdown)
        .processSync('## Hello, world! ##')
        .toString(),
      '## Hello, world!\n'
    )
  })

  await t.test('should bridge with options', async function () {
    assert.equal(
      unified()
        .use(remarkParse)
        .use(remarkRehype, unified(), {allowDangerousHtml: true})
        .use(remarkMarkdown)
        .processSync('## Hello, <i>world</i>! ##')
        .toString(),
      '## Hello, <i>world</i>!\n'
    )
  })
})
