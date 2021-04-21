// Minimum TypeScript Version: 3.2
import {Plugin, Processor} from 'unified'
import {Options} from 'mdast-util-to-hast'

interface Settings extends Array<any> {
  0?: Processor
  1?: Options
}

declare const remark2rehype: Plugin<[Options?] | Settings>

export = remark2rehype
