# remark-rehype [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Bridge / mutate from [**remark**][remark] to [**rehype**][rehype].

## Installation

[npm][npm-install]:

```bash
npm install remark-rehype
```

## Usage

```js
var unified = require('unified');
var parse = require('remark-parse');
var remark2rehype = require('remark-rehype');
var highlight = require('rehype-highlight');
var stringify = require('rehype-stringify');
var report = require('vfile-reporter');

unified()
  .use(parse)
  .use(remark2rehype)
  .use(highlight)
  .use(stringify)
  .process([
    '## Hello, world!',
    '',
    '    "use strict"',
    '    var name = "World";',
    '    console.log("Hello, " + name + "!");',
    ''
  ].join('\n'), function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

**stderr**(4) yields:

```txt
no issues found
```

**stdout**(4) yields:

```html
<h2>Hello, world!</h2>
<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>
<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>);
</code></pre>
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

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/remark-rehype.svg

[travis]: https://travis-ci.org/wooorm/remark-rehype

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-rehype.svg

[codecov]: https://codecov.io/github/wooorm/remark-rehype

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/wooorm/mdast

[hast]: https://github.com/wooorm/hast

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype

[processor]: https://github.com/wooorm/unified#processor

[bridge]: https://github.com/wooorm/unified#bridge

[to-hast]: https://github.com/wooorm/mdast-util-to-hast#tohastnode-options
