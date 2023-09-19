import assert from 'node:assert/strict'
import test from 'node:test'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'
import remarkRehype from './index.js'

test('remarkRehype', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
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
          .process('## Hello, world! ##')
      ),
      '<h2>Hello, world!</h2>'
    )
  })

  await t.test('should mutate with options', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkRehype, {allowDangerousHtml: true})
          .use(rehypeStringify, {allowDangerousHtml: true})
          .process('## Hello, <i>world</i>! ##')
      ),
      '<h2>Hello, <i>world</i>!</h2>'
    )
  })

  await t.test(
    'should mutate with `processor: undefined` and options',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(remarkParse)
            // @ts-expect-error: this is not typed as being supported w/ the overload, but always was.
            .use(remarkRehype, undefined, {allowDangerousHtml: true})
            .use(rehypeStringify, {allowDangerousHtml: true})
            .process('## Hello, <i>world</i>! ##')
        ),
        '<h2>Hello, <i>world</i>!</h2>'
      )
    }
  )

  await t.test('should bridge', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          // @ts-expect-error: TS currently barfs on overloads that result in mutate/bridges.
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
          // @ts-expect-error: TS currently barfs on overloads that result in mutate/bridges.
          .use(remarkRehype, unified(), {allowDangerousHtml: true})
          .use(remarkStringify)
          .process('## Hello, <i>world</i>! ##')
      ),
      '## Hello, <i>world</i>!\n'
    )
  })

  await t.test('should understand bridge types', async function () {
    const treeIn = unified().use(remarkParse).parse('hi')
    // @ts-expect-error: TS currently barfs on overloads that result in mutate/bridges.
    const treeOut = await unified().use(remarkRehype, unified()).run(treeIn)
    // @ts-expect-error: TS currently barfs on overloads that result in mutate/bridges.
    const doc = unified().use(remarkStringify).stringify(treeOut)
    assert.equal(doc, 'hi\n')
  })

  await t.test('should understand mutate types', async function () {
    const treeIn = unified().use(remarkParse).parse('hi')
    const treeOut = await unified().use(remarkRehype).run(treeIn)
    const doc = unified().use(rehypeStringify).stringify(treeOut)
    assert.equal(doc, '<p>hi</p>')
  })
})
