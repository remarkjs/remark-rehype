/**
 * @typedef {import('./lib/index.js').Options} Options
 * @typedef {import('./lib/index.js').Processor} Processor
 */

import remarkRehype from './lib/index.js'

export {defaultHandlers, all, one} from 'mdast-util-to-hast'

export default remarkRehype
