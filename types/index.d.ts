// Minimum TypeScript Version: 3.2
import {Plugin, Processor} from 'unified'
import {Options} from 'mdast-util-to-hast'

type Settings =
  | [Options?]
  | {
      length: number
      0?: Processor
      1?: Options
    }

declare const remark2rehype: Plugin<Settings>

export = remark2rehype
