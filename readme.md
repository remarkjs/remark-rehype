# remark-rehype [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Bridge / mutate from [**remark**][remark] to [**rehype**][rehype].

> Note that `remark-rehype` doesn’t deal with HTML inside the markdown.  You’ll
> need [`rehype-raw`][raw] if you’re planning on doing that.

## Installation

[npm][npm-install]:

```bash
npm install remark-rehype
```

## Usage

Say we have the following file, `example.md`:

```markdown
# Hello world

> Block quote.

Some _emphasis_, **importance**, and `code`.
```

And our script, `example.js`, looks as follows:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var markdown = require('remark-parse');
var remark2rehype = require('remark-rehype');
var doc = require('rehype-document');
var format = require('rehype-format');
var html = require('rehype-stringify');

unified()
  .use(markdown)
  .use(remark2rehype)
  .use(doc)
  .use(format)
  .use(html)
  .process(vfile.readSync('example.md'), function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

Now, running `node example` yields:

```html
example.md: no issues found
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world</h1>
    <blockquote>
      <p>Block quote.</p>
    </blockquote>
    <p>Some <em>emphasis</em>, <strong>importance</strong>, and <code>code</code>.</p>
  </body>
</html>
```

## API

### `origin.use(remark2rehype[, destination][, options])`

Either bridge or mutate from [**remark**][remark] ([MDAST][]) to
[**rehype**][rehype] ([HAST][]).

###### `destination`

If given ([`Unified`][processor]), runs the destination processor
with the new HAST tree, then, after running discards that tree and
continues on running the origin processor with the original tree
([bridge-mode][bridge]).  Otherwise, passes the tree to further
plug-ins (mutate-mode).

###### `options`

`options` are passed through to [`mdast-util-to-hast`][to-hast], if given.

## Related

*   [`rehype-raw`][raw]
    — Properly deal with HTML in markdown (used after `remark-rehype`)
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — Transform HTML to markdown
*   [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
    — Transform HTML to [NLCST][]
*   [`remark-retext`](https://github.com/remarkjs/remark-retext)
    — Transform markdown to [NLCST][]

## Contribute

See [`contribute.md` in `remarkjs/remark`][contribute] for ways to get started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/remarkjs/remark-rehype.svg

[travis]: https://travis-ci.org/remarkjs/remark-rehype

[codecov-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-rehype.svg

[codecov]: https://codecov.io/github/remarkjs/remark-rehype

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[processor]: https://github.com/unifiedjs/unified#processor

[bridge]: https://github.com/unifiedjs/unified#processing-between-syntaxes

[to-hast]: https://github.com/syntax-tree/mdast-util-to-hast#tohastnode-options

[nlcst]: https://github.com/syntax-tree/nlcst

[raw]: https://github.com/rehypejs/rehype-raw

[contribute]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md
