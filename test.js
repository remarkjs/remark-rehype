import test from 'tape'
import unified from 'unified'
import parse from 'remark-parse'
import markdown from 'remark-stringify'
import html from 'rehype-stringify'
import remark2rehype from './index.js'

test('remark2rehype()', function (t) {
  t.equal(
    unified()
      .use(parse)
      .use(remark2rehype)
      .use(html)
      .processSync('## Hello, world! ##')
      .toString(),
    '<h2>Hello, world!</h2>',
    'should mutate'
  )

  t.equal(
    unified()
      .use(parse)
      .use(remark2rehype, {allowDangerousHtml: true})
      .use(html, {allowDangerousHtml: true})
      .processSync('## Hello, <i>world</i>! ##')
      .toString(),
    '<h2>Hello, <i>world</i>!</h2>',
    'should mutate with options'
  )

  t.equal(
    unified()
      .use(parse)
      .use(remark2rehype, unified())
      .use(markdown)
      .processSync('## Hello, world! ##')
      .toString(),
    '## Hello, world!\n',
    'should bridge'
  )

  t.equal(
    unified()
      .use(parse)
      .use(remark2rehype, unified(), {allowDangerousHtml: true})
      .use(markdown)
      .processSync('## Hello, <i>world</i>! ##')
      .toString(),
    '## Hello, <i>world</i>!\n',
    'should bridge with options'
  )

  t.end()
})
