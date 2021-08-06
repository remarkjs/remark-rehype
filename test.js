import test from 'tape'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMarkdown from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from './index.js'

test('remarkRehype', function (t) {
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
