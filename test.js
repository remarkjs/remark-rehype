/**
 * @import {Text as HastText} from 'hast'
 * @import {Handler} from 'mdast-util-to-hast'
 * @import {Text as MdastText} from 'mdast'
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'

test('remarkRehype', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('remark-rehype')).sort(), [
      'default',
      'defaultFootnoteBackContent',
      'defaultFootnoteBackLabel',
      'defaultHandlers'
    ])
  })

  await t.test('should mutate', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeStringify)
          .process('# hi')
      ),
      '<h1>hi</h1>'
    )
  })

  await t.test('should mutate w/ options', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype, {handlers: {text}})
          .use(rehypeStringify)
          .process('# hi')
      ),
      '<h1>HI</h1>'
    )
  })

  await t.test(
    'should mutate w/ options and explicit unknown 2nd parameter',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(remarkParse)
            // @ts-expect-error: this tests the file set passed by `unified-engine`.
            .use(remarkRehype, {handlers: {text}}, {some: 'option'})
            .use(rehypeStringify)
            .process('# hi')
        ),
        '<h1>HI</h1>'
      )
    }
  )

  await t.test(
    'should mutate with `processor: undefined` and options',
    async function () {
      // This tests the file set passed by `unified-engine`.
      assert.equal(
        String(
          await unified()
            .use(remarkParse)
            .use(remarkRehype, undefined, {handlers: {text}})
            .use(rehypeStringify)
            .process('# hi')
        ),
        '<h1>HI</h1>'
      )
    }
  )

  await t.test('should bridge', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype, unified())
          .use(remarkStringify)
          .process('## Hello, world! ##')
      ),
      '## Hello, world!\n'
    )
  })

  await t.test('should bridge with options', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype, unified(), {allowDangerousHtml: true})
          .use(remarkStringify)
          .process('## Hello, <i>world</i>! ##')
      ),
      '## Hello, <i>world</i>!\n'
    )
  })

  await t.test('should understand bridge types', async function () {
    const treeIn = unified().use(remarkParse).parse('# hi')
    const treeOut = await unified().use(remarkRehype, unified()).run(treeIn)
    // @ts-expect-error: TS currently barfs on overloads that result in mutate/bridges.
    const document = unified().use(remarkStringify).stringify(treeOut)
    assert.equal(document, '# hi\n')
  })

  await t.test('should understand mutate types', async function () {
    const treeIn = unified().use(remarkParse).parse('# hi')
    const treeOut = await unified().use(remarkRehype).run(treeIn)
    const document = unified().use(rehypeStringify).stringify(treeOut)
    assert.equal(document, '<h1>hi</h1>')
  })
})

/**
 * @type {Handler}
 * @param {MdastText} node
 * @returns {HastText}
 */
function text(_, node) {
  return {type: 'text', value: node.value.toUpperCase()}
}
