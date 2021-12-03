import test from 'tape'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMarkdown from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remarkRehype, {defaultHandlers, all, one} from './index.js'

test('exports', (t) => {
  t.assert(defaultHandlers, 'should export `defaultHandlers`')
  t.assert(one, 'should export `one`')
  t.assert(all, 'should export `all`')

  t.end()
})

test('remarkRehype', (t) => {
  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync('## Hello, world! ##')
      .toString(),
    '<h2>Hello, world!</h2>',
    'should mutate'
  )

  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkRehype, {allowDangerousHtml: true})
      .use(rehypeStringify, {allowDangerousHtml: true})
      .processSync('## Hello, <i>world</i>! ##')
      .toString(),
    '<h2>Hello, <i>world</i>!</h2>',
    'should mutate with options'
  )

  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkRehype, null, {allowDangerousHtml: true})
      .use(rehypeStringify, {allowDangerousHtml: true})
      .processSync('## Hello, <i>world</i>! ##')
      .toString(),
    '<h2>Hello, <i>world</i>!</h2>',
    'should mutate with `processor: null` and options'
  )

  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkRehype, unified())
      .use(remarkMarkdown)
      .processSync('## Hello, world! ##')
      .toString(),
    '## Hello, world!\n',
    'should bridge'
  )

  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkRehype, unified(), {allowDangerousHtml: true})
      .use(remarkMarkdown)
      .processSync('## Hello, <i>world</i>! ##')
      .toString(),
    '## Hello, <i>world</i>!\n',
    'should bridge with options'
  )

  t.end()
})
